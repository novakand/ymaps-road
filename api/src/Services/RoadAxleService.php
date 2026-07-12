<?php

declare(strict_types=1);

namespace RouteGIS\Services;

final readonly class RoadAxleService
{
    private const MAX_PROJECTION_DISTANCE = 150.0;
    private const MAX_ANGLE_DIFF = 45.0; // Максимальное отклонение угла в градусах

    public function __construct(
        private RgisService $rgis,
        private SkdfService $skdf,
        private RouteFilterService $routeFilter,
        private AxleLoadService $axleLoad,
        private GeometryService $geometry,
    ) {
    }

    public function analyze(
        array $routeFeatures,
        array $bounds3857,
        int $zoom,
    ): array {
        // ИСПРАВЛЕНИЕ: Фиксируем оптимальный масштаб для загородных и региональных трасс.
        // На зумах 15-17 длинные трассы РГИС часто скрываются или режутся. Зум 13 — идеальный ГИС-стандарт.
        $requestZoom = 13;

        // Безопасно проверяем пришедший BBox. Если он передан в EPSG:3857 (миллионы метров), 
        // мы используем его напрямую для запроса к РГИС.
        $roadsResponse = $this->rgis->getRoadGeobox(
            box: $bounds3857,
            scaleFactor: 1,
            zoom: $requestZoom,
        );

        $roads = $roadsResponse['features'] ?? [];

        // Если РГИС вернул пустоту, логгируем это для отладки
        if (empty($roads)) {
            error_log(sprintf('⚠️ RGIS returned 0 roads for bounds: [%s]', implode(', ', $bounds3857)));
            return $this->createEmptyFeatureCollection();
        }

        // Фильтруем дороги по треку чанка маршрута (использует обновленный RouteFilterService)
        $filteredRoads = $this->routeFilter->filter($roads, $routeFeatures);

        if (empty($filteredRoads)) {
            return $this->createEmptyFeatureCollection();
        }

        // Собираем уникальные road_id для СКДФ
        $roadIds = array_values(array_unique(array_map(
            fn($road) => (int) ($road['properties']['road_id'] ?? 0),
            $filteredRoads
        )));

        // Собираем уникальные категории значения дорог (value_of_the_road_gid)
        $valueOfRoadGids = array_values(array_unique(array_filter(array_map(
            fn($road) => (int) ($road['properties']['value_of_the_road_gid'] ?? 0),
            $filteredRoads
        ))));

        // Собираем уникальные коды регионов (region_gid) для пространственного фоллбэка в СКДФ
        $regionGids = array_values(array_unique(array_filter(array_map(
            fn($road) => (int) ($road['properties']['region_gid'] ?? $road['properties']['region_id'] ?? 0),
            $filteredRoads
        ))));

        if (empty($roadIds)) {
            return $this->createEmptyFeatureCollection();
        }

        // Делаем точечный запрос в СКДФ с тройным фильтром (защита от разрывов и таймаутов на М-12 / 22Р)
        $allRestrictions = $this->skdf->getAxleLoads($roadIds, $valueOfRoadGids, $regionGids);

        $restrictionsByRoadPart = [];
        foreach ($allRestrictions as $restriction) {
            $roadPartId = (int) ($restriction['road_part_id'] ?? 0);
            if ($roadPartId > 0) {
                $restrictionsByRoadPart[$roadPartId][] = $restriction;
            }
        }

        // Запускаем наш точный линейный алгоритм проецирования и нарезки интервалов в памяти PHP
        $coloredSegments = $this->mapAndSplitRouteSegments(
            $routeFeatures,
            $filteredRoads,
            $restrictionsByRoadPart
        );

        return $this->buildFeatureCollection($coloredSegments);
    }


    /**
     * Сопоставляет сегменты маршрута с дорогами
     * ИСПОЛЬЗУЕТ chunkAngle и chunkDistance из свойств
     */
    private function mapAndSplitRouteSegments(
        array $routeFeatures,
        array $roadFeatures,
        array $restrictionsByRoadPart,
    ): array {
        $routeSegments = $this->extractRouteSegments($routeFeatures);
        $result = [];

        error_log('=== MAPPING WITH CHUNK ANGLE AND DISTANCE ===');

        foreach ($routeSegments as $segmentIndex => $segment) {
            $points = $segment['points'] ?? [];

            // Используем chunkDistance вместо distance из Yandex
            $segmentDistance = $segment['chunkDistance'] ?? $segment['distance'] ?? 0;
            $segmentAngle = $segment['chunkAngle'] ?? 0;

            if (empty($points) || $segmentDistance == 0) {
                continue;
            }

            // Находим дорогу для сегмента с учетом угла
            $middleIndex = (int) floor(count($points) / 2);
            $middlePoint = $points[$middleIndex];

            $roadInfo = $this->findNearestRoadWithAngle(
                $middlePoint,
                $roadFeatures,
                $segmentAngle
            );

            if ($roadInfo === null) {
                error_log(sprintf(
                    '⚠️ Segment %d: No road found with angle %.1f°, trying without angle',
                    $segmentIndex,
                    $segmentAngle
                ));
                $roadInfo = $this->findNearestRoad($middlePoint, $roadFeatures);
            }

            if ($roadInfo === null) {
                error_log(sprintf(
                    '⚠️ Segment %d: No road found, skipping',
                    $segmentIndex
                ));
                continue;
            }

            $roadPartId = $roadInfo['road_part_id'];
            $roadProperties = $roadInfo['road_properties'] ?? [];
            $roadGeometry = $roadInfo['geometry'] ?? null;

            if ($roadGeometry === null) {
                continue;
            }

            // Проецируем точки на геометрию дороги
            $projectedPoints = [];
            foreach ($points as $point) {
                $projection = $this->projectPointToRoad($point, $roadGeometry);
                if ($projection !== null) {
                    $projectedPoints[] = [
                        'point' => $point,
                        'm' => $projection['m'],
                        'distance' => $projection['distance'],
                    ];
                }
            }

            if (empty($projectedPoints)) {
                error_log(sprintf(
                    '⚠️ Segment %d: No projections found',
                    $segmentIndex
                ));
                continue;
            }

            // M-координаты начала и конца сегмента
            $segmentStartM = $projectedPoints[0]['m'];
            $segmentEndM = $projectedPoints[count($projectedPoints) - 1]['m'];

            error_log(sprintf(
                '✅ Segment %d: angle=%.1f°, distance=%.0f m, M=[%.0f, %.0f] m, road_part_id=%d',
                $segmentIndex,
                $segmentAngle,
                $segmentDistance,
                $segmentStartM,
                $segmentEndM,
                $roadPartId
            ));

            $restrictions = $restrictionsByRoadPart[$roadPartId] ?? [];

            $subSegments = $this->splitSegmentByRestrictions(
                $projectedPoints,
                $segmentStartM,
                $segmentEndM,
                $restrictions,
                $roadProperties
            );

            $result = array_merge($result, $subSegments);
        }

        error_log('Total colored sub-segments: ' . count($result));
        return $result;
    }

    /**
     * Находит ближайшую дорогу с учетом угла
     */
    /**
     * Находит ближайшую дорогу с учетом угла (Уровень 1)
     * ИСПРАВЛЕНО: Демпфирует параллельное расстояние, защищая от боковых наводок на перекрестках
     */
    private function findNearestRoadWithAngle(
        array $point,
        array $roadFeatures,
        float $routeAngle
    ): ?array {
        $best = null;
        $bestScore = INF;

        foreach ($roadFeatures as $road) {
            $geometry = $road['geometry'] ?? null;
            if (!$geometry) {
                continue;
            }

            $projection = $this->projectPointToRoad($point, $geometry);
            if ($projection === null) {
                continue;
            }

            // Находим сегмент дороги для вычисления угла
            $segment = $this->findProjectedSegment($point, $geometry, $projection);
            if ($segment === null) {
                continue;
            }

            $roadAngle = $this->calculateSegmentAngle($segment['a'], $segment['b']);
            $angleDiff = $this->calculateAngleDifference($routeAngle, $roadAngle);

            // Если угол сильно отличается — пропускаем (на 1-м уровне держим строгий коридор)
            if ($angleDiff > self::MAX_ANGLE_DIFF) {
                continue;
            }

            // ИСПРАВЛЕНИЕ СКОРИНГА НА 1 УРОВНЕ:
            // Умножаем физическую дистанцию на коэффициент 0.1 (демпфируем её).
            // Благодаря этому стабильный параллельный сдвиг в 15 метров превратится всего в +1.5 балла штрафа.
            // Теперь боковая улица, которая оказалась геометрически ближе на перекрестке, 
            // но идет под углом, больше не сможет перебить вашу родную параллельную трассу СКДФ!
            $distancePenalty = $projection['distance'] * 0.1;
            $anglePenalty = $angleDiff * 4.0; // Жесткий приоритет сонаправленности движения

            $score = $distancePenalty + $anglePenalty;

            if ($score < $bestScore) {
                $bestScore = $score;
                $best = [
                    'road_part_id' => (int) ($road['properties']['road_part_id'] ?? 0),
                    'start_km' => (float) ($road['properties']['start_km'] ?? 0),
                    'road_properties' => $road['properties'] ?? [],
                    'geometry' => $geometry,
                    'distance' => $projection['distance'], // сохраняем реальную физическую дистанцию
                    'm' => $projection['m'],
                    'road_angle' => $roadAngle,
                    'angle_diff' => $angleDiff,
                ];
            }
        }

        // Проверяем, что итоговая дистанция до лучшего параллельного кандидата укладывается в лимит
        if ($best !== null && $best['distance'] <= self::MAX_PROJECTION_DISTANCE) {
            return $best;
        }

        return null;
    }

    /**
     * Находит сегмент дороги, на который спроецировалась точка
     */
    private function findProjectedSegment(
        array $point,
        array $geometry,
        array $projection
    ): ?array {
        if (!isset($geometry['type']) || !isset($geometry['coordinates'])) {
            return null;
        }

        $parts = $geometry['type'] === 'LineString'
            ? [$geometry['coordinates']]
            : $geometry['coordinates'];

        $bestSegment = null;
        $bestDistance = INF;

        foreach ($parts as $part) {
            $count = count($part);
            if ($count < 2) {
                continue;
            }

            for ($i = 0; $i < $count - 1; $i++) {
                if (count($part[$i]) < 3 || count($part[$i + 1]) < 3) {
                    continue;
                }

                $result = $this->projectPointToSegment(
                    $point,
                    $part[$i],
                    $part[$i + 1]
                );

                if ($result !== null && $result['distance'] < $bestDistance) {
                    $bestDistance = $result['distance'];
                    $bestSegment = [
                        'a' => $part[$i],
                        'b' => $part[$i + 1],
                        'index' => $i,
                    ];
                }
            }
        }

        return $bestSegment;
    }

    /**
     * Вычисляет угол между двумя точками в градусах
     */
    private function calculateSegmentAngle(array $a, array $b): float
    {
        $dx = $b[0] - $a[0];
        $dy = $b[1] - $a[1];

        $angle = rad2deg(atan2($dx, $dy));

        if ($angle < 0) {
            $angle += 360;
        }

        return $angle;
    }

    /**
     * Вычисляет минимальную разницу между углами
     */
    private function calculateAngleDifference(float $angle1, float $angle2): float
    {
        $diff = abs($angle1 - $angle2);

        if ($diff > 180) {
            $diff = 360 - $diff;
        }

        return $diff;
    }

    /**
     * Находит ближайшую дорогу (без учета угла) - fallback
     */
    private function findNearestRoad(array $point, array $roadFeatures): ?array
    {
        $best = null;
        $bestDistance = INF;

        foreach ($roadFeatures as $road) {
            $geometry = $road['geometry'] ?? null;
            if (!$geometry) {
                continue;
            }

            $projection = $this->projectPointToRoad($point, $geometry);

            if ($projection !== null && $projection['distance'] < $bestDistance) {
                $bestDistance = $projection['distance'];
                $best = [
                    'road_part_id' => (int) ($road['properties']['road_part_id'] ?? 0),
                    'start_km' => (float) ($road['properties']['start_km'] ?? 0),
                    'road_properties' => $road['properties'] ?? [],
                    'geometry' => $geometry,
                    'distance' => $projection['distance'],
                    'm' => $projection['m'],
                ];
            }
        }

        if ($best !== null && $best['distance'] <= self::MAX_PROJECTION_DISTANCE) {
            return $best;
        }

        return null;
    }

    private function projectPointToRoad(array $point, array $geometry): ?array
    {
        if (!isset($geometry['type']) || !isset($geometry['coordinates'])) {
            return null;
        }

        $parts = $geometry['type'] === 'LineString'
            ? [$geometry['coordinates']]
            : $geometry['coordinates'];

        $best = null;
        $bestDistance = INF;

        foreach ($parts as $part) {
            $count = count($part);
            if ($count < 2) {
                continue;
            }

            for ($i = 0; $i < $count - 1; $i++) {
                if (count($part[$i]) < 3 || count($part[$i + 1]) < 3) {
                    continue;
                }

                $result = $this->projectPointToSegment(
                    $point,
                    $part[$i],
                    $part[$i + 1]
                );

                if ($result !== null && $result['distance'] < $bestDistance) {
                    $bestDistance = $result['distance'];
                    $best = [
                        'm' => $result['m'],
                        'distance' => $result['distance'],
                    ];
                }
            }
        }

        return $best;
    }

    private function projectPointToSegment(
        array $point,
        array $a,
        array $b,
    ): ?array {
        $margin = 0.005;

        if (
            $point[0] < min($a[0], $b[0]) - $margin ||
            $point[0] > max($a[0], $b[0]) + $margin ||
            $point[1] < min($a[1], $b[1]) - $margin ||
            $point[1] > max($a[1], $b[1]) + $margin
        ) {
            return null;
        }

        $lat0 = deg2rad(($a[1] + $b[1] + $point[1]) / 3);
        $kx = cos($lat0) * 111320.0;
        $ky = 110540.0;

        $ax = $a[0] * $kx;
        $ay = $a[1] * $ky;
        $bx = $b[0] * $kx;
        $by = $b[1] * $ky;
        $px = $point[0] * $kx;
        $py = $point[1] * $ky;

        $abx = $bx - $ax;
        $aby = $by - $ay;
        $lengthSquared = ($abx * $abx) + ($aby * $aby);

        if ($lengthSquared == 0.0) {
            return null;
        }

        $t = max(0.0, min(1.0, (
            (($px - $ax) * $abx) + (($py - $ay) * $aby)
        ) / $lengthSquared));

        $m = (float) $a[2] + (((float) $b[2] - (float) $a[2]) * $t);
        $distance = hypot(
            $px - ($ax + ($abx * $t)),
            $py - ($ay + ($aby * $t))
        );

        if ($distance > self::MAX_PROJECTION_DISTANCE) {
            return null;
        }

        return [
            'm' => $m,
            'distance' => $distance,
        ];
    }


    /**
     * Разбивает сегмент на подсегменты по ограничениям СКДФ
     * ИСПРАВЛЕНО: Заменяет черный дебаг-цвет нормативным фоллбэком по значению дороги
     */
    private function splitSegmentByRestrictions(
        array $projectedPoints,
        float $segmentStartM,
        float $segmentEndM,
        array $restrictions,
        array $roadProperties,
    ): array {
        // Устанавливаем гарантированные границы диапазона независимо от направления движения
        $segmentMinM = min($segmentStartM, $segmentEndM);
        $segmentMaxM = max($segmentStartM, $segmentEndM);

        // =========================================================================
        // ИСПРАВЛЕНИЕ: Вместо черного дебага подставляем нормативный цвет класса дороги
        // =========================================================================
        if (empty($restrictions)) {
            // Вычисляем класс дороги по её свойствам из РГИС (value_of_the_road_gid)
            // 83717 — Федеральные (М-12, М-7), 83718 — Региональные (22Р-0159)
            $roadClassGid = (int) ($roadProperties['value_of_the_road_gid'] ?? 0);

            // Если это федеральная трасса — нормативный дефолт 11.5т, если региональная (как 22Р) — 10.0т, иначе 6.0т
            if ($roadClassGid === 83717) {
                $defaultLoad = 11.5;
            } elseif ($roadClassGid === 83718) {
                $defaultLoad = 10.0;
            } else {
                $defaultLoad = 10.0; // Безопасный дефолт общего пользования
            }

            // Запрашиваем у AxleLoadService правильный цвет для этой нагрузки (Зеленый или Оранжевый)
            // Внимание: метод resolveColor в AxleLoadService должен быть объявлен как public!
            $fallbackColor = $this->axleLoad->resolveColor($defaultLoad);

            return [
                [
                    'points' => array_column($projectedPoints, 'point'),
                    'color' => $fallbackColor, // Маршрут станет сочным оранжевым/зеленым без черных дыр!
                    'road_properties' => array_merge($roadProperties, [
                        'max_axle_load' => $defaultLoad,
                        'is_fallback_nominal' => true
                    ]),
                    'start_m' => $segmentMinM,
                    'end_m' => $segmentMaxM,
                ]
            ];
        }
        // =========================================================================

        $breakpoints = [$segmentMinM, $segmentMaxM];
        foreach ($restrictions as $restriction) {
            $startM = $this->parseMeasure($restriction['start'] ?? '');
            $endM = $this->parseMeasure($restriction['finish'] ?? '');

            if ($startM > $segmentMinM && $startM < $segmentMaxM) {
                $breakpoints[] = $startM;
            }
            if ($endM > $segmentMinM && $endM < $segmentMaxM) {
                $breakpoints[] = $endM;
            }
        }

        sort($breakpoints);
        $breakpoints = array_values(array_unique($breakpoints, SORT_NUMERIC));

        $intervals = [];
        for ($i = 0; $i < count($breakpoints) - 1; $i++) {
            $subStartM = $breakpoints[$i];
            $subEndM = $breakpoints[$i + 1];

            $axleData = $this->axleLoad->resolveRestrictionsForInterval($subStartM, $subEndM, $restrictions);

            $intervals[] = [
                'start_m' => $subStartM,
                'end_m' => $subEndM,
                'points' => [],
                'color' => $axleData['statusColor'],
                'axle_data' => $axleData
            ];
        }

        $totalPoints = count($projectedPoints);

        for ($j = 0; $j < $totalPoints - 1; $j++) {
            $p1 = $projectedPoints[$j];
            $p2 = $projectedPoints[$j + 1];

            $m1 = $p1['m'];
            $m2 = $p2['m'];

            $rStartM = min($m1, $m2);
            $rEndM = max($m1, $m2);

            foreach ($intervals as &$interval) {
                if ($rEndM >= $interval['start_m'] && $rStartM <= $interval['end_m']) {
                    $ptA = $p1['point'];
                    $ptB = $p2['point'];
                    $mDist = abs($m2 - $m1);

                    if ($mDist > 0.001) {
                        if ($rStartM < $interval['start_m'] && $rEndM > $interval['start_m']) {
                            $ratio = ($interval['start_m'] - $rStartM) / $mDist;
                            $actualRatio = ($m2 > $m1) ? $ratio : (1.0 - $ratio);
                            $ptA = $this->interpolatePoint($p1['point'], $p2['point'], max(0.0, min(1.0, $actualRatio)));
                        }

                        if ($rStartM < $interval['end_m'] && $rEndM > $interval['end_m']) {
                            $ratio = ($interval['end_m'] - $rStartM) / $mDist;
                            $actualRatio = ($m2 > $m1) ? $ratio : (1.0 - $ratio);
                            $ptB = $this->interpolatePoint($p1['point'], $p2['point'], max(0.0, min(1.0, $actualRatio)));
                        }
                    }

                    if (empty($interval['points'])) {
                        $interval['points'][] = $ptA;
                    }
                    $interval['points'][] = $ptB;
                }
            }
        }
        unset($interval);

        $result = [];
        foreach ($intervals as $interval) {
            $cleanPoints = [];
            foreach ($interval['points'] as $pt) {
                if (empty($cleanPoints) || end($cleanPoints) !== $pt) {
                    $cleanPoints[] = $pt;
                }
            }

            if (count($cleanPoints) >= 2) {
                $mergedProperties = array_merge($roadProperties, [
                    'max_axle_load' => $interval['axle_data']['max_axle_load'],
                    'km_start' => $interval['axle_data']['km_start'],
                    'km_finish' => $interval['axle_data']['km_finish'],
                    'skdf_road_name' => $interval['axle_data']['road_name'],
                ]);

                $result[] = [
                    'points' => $cleanPoints,
                    'color' => $interval['color'],
                    'road_properties' => $mergedProperties,
                    'start_m' => $interval['start_m'],
                    'end_m' => $interval['end_m'],
                ];
            }
        }

        // Финальный фоллбэк: если из-за микроокруглений интервалы не собрали точки,
        // мы точно так же применяем здесь нормативный цвет класса дороги вместо черного хардкода
        if (empty($result)) {
            $roadClassGid = (int) ($roadProperties['value_of_the_road_gid'] ?? 0);
            $defaultLoad = ($roadClassGid === 83717) ? 11.5 : 10.0;
            $fallbackColor = $this->axleLoad->resolveColor($defaultLoad);

            $result[] = [
                'points' => array_column($projectedPoints, 'point'),
                'color' => $fallbackColor,
                'road_properties' => array_merge($roadProperties, [
                    'max_axle_load' => $defaultLoad,
                    'is_fallback_nominal' => true
                ]),
                'start_m' => $segmentMinM,
                'end_m' => $segmentMaxM,
            ];
        }

        return $result;
    }


    private function interpolatePoint(array $p1, array $p2, float $ratio): array
    {
        return [
            $p1[0] + ($p2[0] - $p1[0]) * $ratio,
            $p1[1] + ($p2[1] - $p1[1]) * $ratio,
        ];
    }

    private function getColorForMRange(
        float $startM,
        float $endM,
        array $restrictions,
    ): string {
        $defaultColor = '#22C55E';
        $maxRestrictionLoad = null;
        $hasRestriction = false;

        foreach ($restrictions as $restriction) {
            $restrictionStart = $this->parseMeasure($restriction['start'] ?? '');
            $restrictionEnd = $this->parseMeasure($restriction['finish'] ?? '');
            $maxAxleLoad = (float) ($restriction['os']['name'] ?? 11.5);

            if ($startM <= $restrictionEnd && $endM >= $restrictionStart) {
                $hasRestriction = true;
                if ($maxRestrictionLoad === null || $maxAxleLoad < $maxRestrictionLoad) {
                    $maxRestrictionLoad = $maxAxleLoad;
                }
            }
        }

        if (!$hasRestriction || $maxRestrictionLoad === null) {
            return $defaultColor;
        }

        return $this->resolveStatusColor($maxRestrictionLoad);
    }

    private function parseMeasure(?string $value): float
    {
        if ($value === null || $value === '') {
            return 0.0;
        }

        $value = trim((string) $value);

        if (strpos($value, '+') !== false) {
            [$km, $meters] = array_pad(explode('+', $value), 2, 0);
            return ((float) $km * 1000.0) + (float) $meters;
        }

        if (is_numeric($value)) {
            return (float) $value * 1000.0;
        }

        return 0.0;
    }

    private function resolveStatusColor(float $axleLoad): string
    {
        if ($axleLoad <= 6) {
            return '#EF4444';
        }
        if ($axleLoad <= 10) {
            return '#F59E0B';
        }
        return '#22C55E';
    }

    private function extractRouteSegments(array $routeFeatures): array
    {
        $segments = [];

        foreach ($routeFeatures as $feature) {
            $geometry = $feature['geometry'] ?? null;
            $properties = $feature['properties'] ?? [];

            if (!$geometry) {
                continue;
            }

            // Извлекаем chunkDistance (приоритет)
            $chunkDistance = 0;
            if (isset($properties['chunkDistance'])) {
                $chunkDistance = (float) $properties['chunkDistance'];
            }

            // Извлекаем chunkAngle (приоритет)
            $chunkAngle = 0;
            if (isset($properties['chunkAngle'])) {
                $chunkAngle = (float) $properties['chunkAngle'];
            }

            // Извлекаем distance из Yandex (fallback)
            $distance = 0;
            if (isset($properties['distance']['value'])) {
                $distance = (float) $properties['distance']['value'];
            } elseif (isset($properties['rawProperties']['SegmentMetaData']['Distance']['value'])) {
                $distance = (float) $properties['rawProperties']['SegmentMetaData']['Distance']['value'];
            }

            $coords = match ($geometry['type']) {
                'LineString' => $geometry['coordinates'],
                'MultiLineString' => array_merge(...$geometry['coordinates']),
                default => [],
            };

            if (empty($coords)) {
                continue;
            }

            $segments[] = [
                'points' => $coords,
                'distance' => $distance, // из Yandex
                'chunkDistance' => $chunkDistance, // вычисленная на фронтенде
                'chunkAngle' => $chunkAngle, // вычисленный на фронтенде
                'properties' => $properties,
            ];
        }

        return $segments;
    }

    private function buildFeatureCollection(array $coloredSegments): array
    {
        $features = [];

        foreach ($coloredSegments as $segment) {
            $points = $segment['points'] ?? [];
            $color = $segment['color'] ?? '#22C55E';
            $roadProperties = $segment['road_properties'] ?? [];

            if (empty($points) || count($points) < 2) {
                continue;
            }

            $features[] = [
                'type' => 'Feature',
                'properties' => $this->buildProperties($color, $roadProperties),
                'geometry' => [
                    'type' => 'LineString',
                    'coordinates' => $points,
                ],
            ];
        }

        return [
            'type' => 'FeatureCollection',
            'features' => $features,
        ];
    }

    private function buildProperties(string $color, array $roadProperties): array
    {
        $strokeWidth = 8;
        $hintContent = 'Проезд разрешен';

        if ($color === '#EF4444') {
            $strokeWidth = 8;
            $hintContent = '⚠️ Критическое ограничение (≤ 6 т)';
        } elseif ($color === '#F59E0B') {
            $strokeWidth = 8;
            $hintContent = '⚠️ Ограничение (6-10 т)';
        } else {
            $hintContent = '✅ Проезд разрешен (> 10 т)';
        }

        $properties = [
            'strokeColor' => $color,
            'strokeWidth' => $strokeWidth,
            'strokeOpacity' => 0.9,
            'hintContent' => $hintContent,
        ];

        if (!empty($roadProperties)) {
            $properties = array_merge($properties, $roadProperties);
        }

        return $properties;
    }

    private function createEmptyFeatureCollection(): array
    {
        return [
            'type' => 'FeatureCollection',
            'features' => [],
        ];
    }
}