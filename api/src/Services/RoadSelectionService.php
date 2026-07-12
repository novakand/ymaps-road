<?php

declare(strict_types=1);

namespace RouteGIS\Services;

final readonly class RoadSelectionService
{
    private const EARTH_CIRCUMFERENCE = 20037508.34;

    public function __construct(
        private RgisService $rgis,
        private SkdfService $skdf,
        private GeometryService $geometry,
    ) {
    }

    public function findRoadByPoint(
        float $longitude,
        float $latitude,
        int $zoom = 16,
    ): array {
        $radius = 50.0;

        $latOffset = $radius / 110540.0;
        $lngOffset = $radius / (
            cos(deg2rad($latitude)) * 111320.0
        );

        $min = $this->wgs84To3857(
            $longitude - $lngOffset,
            $latitude - $latOffset
        );

        $max = $this->wgs84To3857(
            $longitude + $lngOffset,
            $latitude + $latOffset
        );

        $roadsResponse = $this->rgis->getRoadGeobox(
            box: [
                $min[0],
                $min[1],
                $max[0],
                $max[1],
            ],
            scaleFactor: 1,
            zoom: $zoom,
        );

        $roads = $this->geometry->convertFeatures(
            $roadsResponse['features'] ?? []
        );

        if (empty($roads)) {
            return [];
        }

        $nearestRoad = null;
        $minDistance = INF;

        foreach ($roads as $road) {
            $geometry = $road['geometry'] ?? null;

            if ($geometry === null) {
                continue;
            }

            $parts = match ($geometry['type']) {
                'LineString' => [$geometry['coordinates']],
                'MultiLineString' => $geometry['coordinates'],
                default => [],
            };

            foreach ($parts as $coordinates) {
                $distance = $this->geometry->pointToLineDistance(
                    [$longitude, $latitude],
                    $coordinates
                );

                if ($distance < $minDistance) {
                    $minDistance = $distance;
                    $nearestRoad = $road;
                }
            }
        }

        if ($nearestRoad === null) {
            return [];
        }

        $roadId = (int) ($nearestRoad['properties']['road_id'] ?? 0);

        if ($roadId <= 0) {
            return [];
        }

        $axleLoads = $this->skdf->getAxleLoads([$roadId]);
        $roadPartIndex = [];

        foreach ($roadsResponse['features'] ?? [] as $feature) {
            $roadPartId = (int) ($feature['properties']['road_part_id'] ?? 0);

            if ($roadPartId <= 0) {
                continue;
            }

            $roadPartIndex[$roadPartId] = $feature;
        }

        $roadPartFeatures = [];

        foreach ($axleLoads as $restriction) {
            $roadPartId = (int) ($restriction['road_part_id'] ?? 0);

            if (!isset($roadPartIndex[$roadPartId])) {
                continue;
            }

            $feature = $roadPartIndex[$roadPartId];

            $maxAxleLoad = (float) ($restriction['os']['name'] ?? 11.5);

            // Ограничение из СКДФ
            $startMeasure = $this->parseMeasure($restriction['start'] ?? '');
            $finishMeasure = $this->parseMeasure($restriction['finish'] ?? '');

            // Геометрия участка дороги
            $geometry = $feature['geometry']['coordinates'];

            // Вырезаем участок по M
            $clippedGeometry = $this->clipByMeasure(
                $geometry,
                $startMeasure,
                $finishMeasure
            );

            if ($clippedGeometry === null) {
                continue;
            }

            // Конвертируем координаты из EPSG:3857 в WGS84 и убираем меру M
            $convertedLines = [];
            foreach ($clippedGeometry as $line) {
                $convertedLine = [];
                foreach ($line as $point) {
                    [$x, $y] = $this->epsg3857ToWgs84($point[0], $point[1]);
                    $convertedLine[] = [$x, $y];
                }
                $convertedLines[] = $convertedLine;
            }

            // Всегда преобразуем в LineString, объединяя все линии
            $mergedLine = $this->mergeLines($convertedLines);

            $feature['geometry'] = [
                'type' => 'LineString',
                'coordinates' => $mergedLine,
            ];

            $feature['properties'] = array_merge(
                $feature['properties'] ?? [],
                $restriction,
                [
                    'max_axle_load' => $maxAxleLoad,
                    'statusColor' => $this->resolveStatusColor($maxAxleLoad),
                ]
            );

            // Уникальный идентификатор Feature
            $feature['id'] = (string) $restriction['id'];

            $roadPartFeatures[] = $feature;
        }

        return $roadPartFeatures;
    }

    /**
     * EPSG:3857 -> WGS84
     *
     * @return array{0:float,1:float}
     */
    private function epsg3857ToWgs84(float $x, float $y): array
    {
        $lon = ($x * 180) / self::EARTH_CIRCUMFERENCE;
        $lat = (atan(exp(($y * M_PI) / self::EARTH_CIRCUMFERENCE)) * 360) / M_PI - 90;

        return [$lon, $lat];
    }

    private function parseMeasure(?string $value): float
    {
        if ($value === null || $value === '') {
            return 0.0;
        }

        [$km, $meters] = array_pad(explode('+', $value), 2, 0);

        return ((float) $km * 1000.0) + (float) $meters;
    }

    /**
     * Интерполяция точки XYZM.
     */
    private function interpolatePoint(array $a, array $b, float $measure): array
    {
        $m1 = (float) $a[2];
        $m2 = (float) $b[2];

        if ($m1 === $m2) {
            return [
                $a[0],
                $a[1],
                $measure,
            ];
        }

        $t = ($measure - $m1) / ($m2 - $m1);

        return [
            $a[0] + ($b[0] - $a[0]) * $t,
            $a[1] + ($b[1] - $a[1]) * $t,
            $measure,
        ];
    }

    /**
     * Проверяет пересечение диапазонов.
     */
    private function rangesIntersect(
        float $aStart,
        float $aFinish,
        float $bStart,
        float $bFinish,
    ): bool {
        return max($aStart, $bStart) <= min($aFinish, $bFinish);
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

    /**
     * WGS84 -> EPSG:3857.
     *
     * @return array{0:float,1:float}
     */
    private function wgs84To3857(float $longitude, float $latitude): array
    {
        $x = $longitude * self::EARTH_CIRCUMFERENCE / 180.0;

        $y = log(
            tan(
                (90.0 + $latitude) * M_PI / 360.0
            )
        ) / (M_PI / 180.0);

        $y = $y * self::EARTH_CIRCUMFERENCE / 180.0;

        return [$x, $y];
    }

    /**
     * Вырезает участок линии по линейной мере (M).
     */
    private function clipByMeasure(
        array $geometry,
        float $startMeasure,
        float $finishMeasure,
    ): ?array {
        $result = [];

        foreach ($geometry as $line) {
            $newLine = [];
            $count = count($line);

            for ($i = 0; $i < $count - 1; $i++) {
                $a = $line[$i];
                $b = $line[$i + 1];

                $m1 = (float) $a[2];
                $m2 = (float) $b[2];

                $segmentStart = min($m1, $m2);
                $segmentFinish = max($m1, $m2);

                if (
                    !$this->rangesIntersect(
                        $segmentStart,
                        $segmentFinish,
                        $startMeasure,
                        $finishMeasure
                    )
                ) {
                    continue;
                }

                if ($m1 >= $startMeasure && $m1 <= $finishMeasure) {
                    $newLine[] = $a;
                }

                if ($m1 < $startMeasure && $m2 > $startMeasure) {
                    $newLine[] = $this->interpolatePoint(
                        $a,
                        $b,
                        $startMeasure
                    );
                }

                if ($m1 < $finishMeasure && $m2 > $finishMeasure) {
                    $newLine[] = $this->interpolatePoint(
                        $a,
                        $b,
                        $finishMeasure
                    );
                }
            }

            if ($count > 0) {
                $lastPoint = $line[$count - 1];
                $lastM = (float) $lastPoint[2];
                if ($lastM >= $startMeasure && $lastM <= $finishMeasure) {
                    $newLine[] = $lastPoint;
                }
            }

            if (!empty($newLine)) {
                $result[] = $newLine;
            }
        }

        return empty($result) ? null : $result;
    }

    /**
     * Объединяет несколько линий в одну.
     * 
     * @param array $lines Массив линий [[x,y], [x,y], ...]
     * @return array Объединенная линия
     */
    private function mergeLines(array $lines): array
    {
        if (empty($lines)) {
            return [];
        }

        if (count($lines) === 1) {
            return $lines[0];
        }

        // Объединяем все линии в одну
        $merged = [];
        foreach ($lines as $line) {
            if (empty($line)) {
                continue;
            }

            // Проверяем, нужно ли соединять с предыдущей линией
            if (!empty($merged)) {
                $lastPoint = end($merged);
                $firstPoint = $line[0];

                // Если точки не совпадают, добавляем соединительную линию (опционально)
                // Если точки совпадают, просто пропускаем первую точку
                $startIndex = ($lastPoint[0] === $firstPoint[0] && $lastPoint[1] === $firstPoint[1]) ? 1 : 0;

                for ($i = $startIndex; $i < count($line); $i++) {
                    $merged[] = $line[$i];
                }
            } else {
                $merged = array_merge($merged, $line);
            }
        }

        return $merged;
    }
}