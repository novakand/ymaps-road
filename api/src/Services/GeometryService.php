<?php

declare(strict_types=1);

namespace RouteGIS\Services;

final class GeometryService
{
    /**
     * Конвертирует GeoJSON Feature из EPSG:3857 в WGS84.
     */
    public function convertFeature(array $feature): array
    {
        if (!isset($feature['geometry'])) {
            return $feature;
        }

        $geometry = $feature['geometry'];

        switch ($geometry['type']) {

            case 'LineString':

                $geometry['coordinates'] =
                    $this->convertCoordinates(
                        $geometry['coordinates']
                    );

                break;


            case 'MultiLineString':

                foreach ($geometry['coordinates'] as $i => $line) {

                    $geometry['coordinates'][$i] =
                        $this->convertCoordinates($line);
                }

                break;
        }

        $feature['geometry'] = $geometry;

        return $feature;
    }


    /**
     * Конвертация массива GeoJSON Feature.
     */
    public function convertFeatures(array $features): array
    {
        foreach ($features as $i => $feature) {

            $features[$i] = $this->convertFeature($feature);
        }

        return $features;
    }


    /**
     * Аналог turf.nearestPointOnLine().
     *
     * Возвращает:
     *  - distance — минимальное расстояние до маршрута (метры)
     *  - location — расстояние вдоль маршрута (метры)
     *
     * @param array{0:float,1:float} $point
     * @param array<array{0:float,1:float}> $routeCoordinates
     *
     * @return array{
     *     distance: float,
     *     location: float
     * }
     */
    private function nearestPointOnRoute(
        array $point,
        array $routeCoordinates,
    ): array {

        $bestDistance = INF;
        $bestLocation = 0.0;

        $location = 0.0;

        $count = count($routeCoordinates);

        for ($i = 0; $i < $count - 1; $i++) {

            $start = $routeCoordinates[$i];
            $end = $routeCoordinates[$i + 1];

            $projection = $this->projectPointToSegment(
                $point,
                $start,
                $end
            );

            if ($projection['distance'] < $bestDistance) {

                $bestDistance = $projection['distance'];

                $bestLocation =
                    $location +
                    $projection['offset'];
            }

            $location += $this->segmentLength(
                $start,
                $end
            );
        }

        return [
            'distance' => $bestDistance,
            'location' => $bestLocation,
        ];
    }


    /**
     * Длина сегмента в метрах.
     *
     * @param array{0:float,1:float} $start
     * @param array{0:float,1:float} $end
     */
    private function segmentLength(
        array $start,
        array $end,
    ): float {

        $lat = deg2rad(
            ($start[1] + $end[1]) / 2
        );

        $scaleX = cos($lat) * 111320;
        $scaleY = 110540;

        $dx = ($end[0] - $start[0]) * $scaleX;
        $dy = ($end[1] - $start[1]) * $scaleY;

        return hypot($dx, $dy);
    }
    /**
     * EPSG:3857 -> WGS84.
     *
     * @return array{0:float,1:float}
     */
    public function convertPoint3857To4326(
        float $x,
        float $y,
    ): array {

        $longitude = $x * 180.0 / 20037508.34;

        $latitude = atan(
            exp(
                $y * M_PI / 20037508.34
            )
        );

        $latitude = $latitude * 360.0 / M_PI - 90.0;

        return [
            $longitude,
            $latitude,
        ];
    }

    /**
     * Разбивает MultiLineString на отдельные Feature.
     *
     * @param array $feature
     *
     * @return array
     */
    public function explodeFeature(array $feature): array
    {
        $geometry = $feature['geometry'] ?? null;

        if ($geometry === null) {
            return [];
        }

        if ($geometry['type'] === 'LineString') {
            return [$feature];
        }

        if ($geometry['type'] !== 'MultiLineString') {
            return [];
        }

        $result = [];

        foreach ($geometry['coordinates'] as $index => $coordinates) {

            $line = $feature;

            $line['id'] =
                ($feature['id'] ?? uniqid()) . '_' . $index;

            $line['geometry'] = [
                'type' => 'LineString',
                'coordinates' => $coordinates,
            ];

            $result[] = $line;
        }

        return $result;
    }

    /**
     * Проекция точки на сегмент.
     *
     * Возвращает:
     *  - distance — расстояние до сегмента
     *  - offset — положение проекции вдоль сегмента
     *
     * @param array{0:float,1:float} $point
     * @param array{0:float,1:float} $start
     * @param array{0:float,1:float} $end
     *
     * @return array{
     *     distance: float,
     *     offset: float
     * }
     */
    private function projectPointToSegment(
        array $point,
        array $start,
        array $end,
    ): array {

        $lat = deg2rad(
            ($point[1] + $start[1] + $end[1]) / 3
        );

        $scaleX = cos($lat) * 111320;
        $scaleY = 110540;

        $px = $point[0] * $scaleX;
        $py = $point[1] * $scaleY;

        $x1 = $start[0] * $scaleX;
        $y1 = $start[1] * $scaleY;

        $x2 = $end[0] * $scaleX;
        $y2 = $end[1] * $scaleY;

        $dx = $x2 - $x1;
        $dy = $y2 - $y1;

        if ($dx === 0.0 && $dy === 0.0) {

            return [
                'distance' => hypot(
                    $px - $x1,
                    $py - $y1
                ),
                'offset' => 0.0,
            ];
        }

        $t = (
            (($px - $x1) * $dx) +
            (($py - $y1) * $dy)
        ) / (
            ($dx * $dx) +
            ($dy * $dy)
        );

        $t = max(
            0.0,
            min(
                1.0,
                $t
            )
        );

        $nearestX = $x1 + $t * $dx;
        $nearestY = $y1 + $t * $dy;

        return [
            'distance' => hypot(
                $px - $nearestX,
                $py - $nearestY
            ),
            'offset' => $t * hypot(
                $dx,
                $dy
            ),
        ];
    }


    /**
     * Аналог turf.lineSliceAlong().
     *
     * Вырезает участок маршрута между двумя
     * расстояниями вдоль линии.
     *
     * @param array<array{0:float,1:float}> $routeCoordinates
     *
     * @return array<array{0:float,1:float}>
     */
    private function sliceRoute(
        array $routeCoordinates,
        float $startLocation,
        float $endLocation,
    ): array {

        if ($endLocation <= $startLocation) {
            return [];
        }

        $result = [];

        $location = 0.0;

        $count = count($routeCoordinates);

        for ($i = 0; $i < $count - 1; $i++) {

            $start = $routeCoordinates[$i];
            $end = $routeCoordinates[$i + 1];

            $segmentLength = $this->segmentLength(
                $start,
                $end
            );

            $segmentStart = $location;
            $segmentEnd = $location + $segmentLength;

            // сегмент полностью до нужного участка
            if ($segmentEnd < $startLocation) {

                $location += $segmentLength;

                continue;
            }

            // сегмент полностью после участка
            if ($segmentStart > $endLocation) {
                break;
            }

            // начало
            if (empty($result)) {

                if ($startLocation > $segmentStart) {

                    $t =
                        ($startLocation - $segmentStart)
                        / $segmentLength;

                    $result[] = $this->interpolate(
                        $start,
                        $end,
                        $t
                    );

                } else {

                    $result[] = $start;
                }
            }

            // конец
            if ($segmentEnd >= $endLocation) {

                $t =
                    ($endLocation - $segmentStart)
                    / $segmentLength;

                $result[] = $this->interpolate(
                    $start,
                    $end,
                    $t
                );

                break;
            }

            $result[] = $end;

            $location += $segmentLength;
        }

        return $result;
    }


    /**
     * Интерполяция точки на сегменте.
     *
     * @param array{0:float,1:float} $start
     * @param array{0:float,1:float} $end
     *
     * @return array{0:float,1:float}
     */
    private function interpolate(
        array $start,
        array $end,
        float $t,
    ): array {

        return [
            $start[0] + ($end[0] - $start[0]) * $t,
            $start[1] + ($end[1] - $start[1]) * $t,
        ];
    }


    /**
     * Проецирует дорогу РГИС на маршрут Яндекса.
     *
     * Возвращает геометрию маршрута Яндекса,
     * соответствующую данной дороге.
     *
     * @param array $roadGeometry
     * @param array<array{0:float,1:float}> $routeCoordinates
     *
     * @return array|null
     */
    public function colorizeRoute(
        array $roadGeometry,
        array $routeFeatures,
    ): ?array {

        $routeCoordinates = $this->extractRouteCoordinates(
            $routeFeatures
        );

        if (
            empty($routeCoordinates) ||
            !isset($roadGeometry['coordinates'])
        ) {
            return null;
        }

        $parts =
            $roadGeometry['type'] === 'LineString'
            ? [$roadGeometry['coordinates']]
            : $roadGeometry['coordinates'];


        error_log(
            'Route points: ' . count($routeCoordinates)
        );

        error_log(
            'Road parts: ' . count($parts)
        );

        $matchDistance = 50.0; // метров
        $padding = 5.0;       // метров

        $minLocation = INF;
        $maxLocation = -INF;

        $hasMatch = false;



        foreach ($parts as $part) {


            error_log(
                'Part points: ' . count($part)
            );


            if (count($part) < 2) {
                continue;
            }

            foreach ($part as $coordinate) {

                $nearest = $this->nearestPointOnRoute(
                    $coordinate,
                    $routeCoordinates
                );

                if ($nearest['distance'] > $matchDistance) {
                    continue;
                }

                $hasMatch = true;

                $minLocation = min(
                    $minLocation,
                    $nearest['location']
                );

                $maxLocation = max(
                    $maxLocation,
                    $nearest['location']
                );
            }
        }

        if (!$hasMatch) {
            return null;
        }

        if ($maxLocation <= $minLocation) {
            return null;
        }

        $coordinates = $this->sliceRoute(
            $routeCoordinates,
            max(0.0, $minLocation - $padding),
            $maxLocation + $padding
        );

        if (count($coordinates) < 2) {
            return null;
        }

        return [
            'type' => 'LineString',
            'coordinates' => $coordinates,
        ];
    }


    /**
     * Аналог turf.pointToLineDistance().
     *
     * Возвращает расстояние в метрах
     * от точки до ближайшего сегмента линии.
     *
     * @param array{0:float,1:float} $point [lng,lat]
     * @param array<array{0:float,1:float}> $lineCoordinates
     */
    public function pointToLineDistance(
        array $point,
        array $lineCoordinates,
    ): float {

        $minDistance = INF;

        $count = count($lineCoordinates);

        if ($count < 2) {
            return $minDistance;
        }


        for ($i = 0; $i < $count - 1; $i++) {

            $distance = $this->pointToSegmentDistance(
                $point,
                $lineCoordinates[$i],
                $lineCoordinates[$i + 1]
            );


            if ($distance < $minDistance) {
                $minDistance = $distance;
            }
        }

        return $minDistance;
    }


    /**
     * Расстояние от точки до сегмента линии.
     *
     * Используем локальную проекцию в метры.
     */
    private function pointToSegmentDistance(
        array $point,
        array $start,
        array $end,
    ): float {

        $lat = deg2rad(
            ($point[1] + $start[1] + $end[1]) / 3
        );


        $scaleX = cos($lat) * 111320;
        $scaleY = 110540;


        $px = $point[0] * $scaleX;
        $py = $point[1] * $scaleY;


        $x1 = $start[0] * $scaleX;
        $y1 = $start[1] * $scaleY;


        $x2 = $end[0] * $scaleX;
        $y2 = $end[1] * $scaleY;


        $dx = $x2 - $x1;
        $dy = $y2 - $y1;


        if ($dx === 0.0 && $dy === 0.0) {

            return hypot(
                $px - $x1,
                $py - $y1
            );
        }


        $t = (
            (($px - $x1) * $dx) +
            (($py - $y1) * $dy)
        ) / (
            ($dx * $dx) +
            ($dy * $dy)
        );


        $t = max(
            0,
            min(1, $t)
        );


        $nearestX = $x1 + ($t * $dx);
        $nearestY = $y1 + ($t * $dy);


        return hypot(
            $px - $nearestX,
            $py - $nearestY
        );
    }


    /**
     * Обрезает дорогу по маршруту.
     *
     * Возвращает только те части дороги,
     * которые находятся в пределах maxDistance
     * от маршрута.
     *
     * @param array<array{0:float,1:float}> $roadCoordinates
     * @param array<array{0:float,1:float}> $routeCoordinates
     *
     * @return array<array<array{0:float,1:float}>>
     */
    public function clipLineToRoute(
        array $roadCoordinates,
        array $routeCoordinates,
        float $maxDistance = 25.0,
    ): array {

        $result = [];
        $currentLine = [];

        $count = count($roadCoordinates);

        if ($count < 2) {
            return [];
        }

        for ($i = 0; $i < $count - 1; $i++) {

            $start = $roadCoordinates[$i];
            $end = $roadCoordinates[$i + 1];

            // середина сегмента
            $middle = [
                ($start[0] + $end[0]) / 2,
                ($start[1] + $end[1]) / 2,
            ];

            $distance = $this->pointToLineDistance(
                $middle,
                $routeCoordinates
            );

            if ($distance <= $maxDistance) {

                if (empty($currentLine)) {
                    $currentLine[] = $start;
                }

                $currentLine[] = $end;

                continue;
            }

            if (count($currentLine) >= 2) {
                $result[] = $currentLine;
            }

            $currentLine = [];
        }

        if (count($currentLine) >= 2) {
            $result[] = $currentLine;
        }

        return $result;
    }

    /**
     * Находит точку выхода/входа сегмента в область маршрута.
     *
     * Используется бинарный поиск между двумя точками.
     *
     * @param array{0:float,1:float} $inside
     * @param array{0:float,1:float} $outside
     * @param array<array{0:float,1:float}> $routeCoordinates
     *
     * @return array{0:float,1:float}
     */
    private function interpolateClipPoint(
        array $inside,
        array $outside,
        array $routeCoordinates,
        float $maxDistance,
    ): array {

        $a = $inside;
        $b = $outside;

        for ($i = 0; $i < 20; $i++) {

            $mid = [
                ($a[0] + $b[0]) / 2,
                ($a[1] + $b[1]) / 2,
            ];

            $distance = $this->pointToLineDistance(
                $mid,
                $routeCoordinates
            );

            if ($distance <= $maxDistance) {
                $a = $mid;
            } else {
                $b = $mid;
            }
        }

        return $a;
    }
    /**
     * Собирает все координаты маршрута
     * из GeoJSON Feature.
     *
     * @param array $routeFeatures
     * @return array<array{0:float,1:float}>
     */
    public function extractRouteCoordinates(
        array $routeFeatures,
    ): array {

        $coordinates = [];

        foreach ($routeFeatures as $feature) {

            $geometry = $feature['geometry'] ?? null;

            if ($geometry === null) {
                continue;
            }

            switch ($geometry['type']) {

                case 'LineString':

                    foreach ($geometry['coordinates'] as $coordinate) {
                        $coordinates[] = $coordinate;
                    }

                    break;

                case 'MultiLineString':

                    foreach ($geometry['coordinates'] as $line) {

                        foreach ($line as $coordinate) {
                            $coordinates[] = $coordinate;
                        }
                    }

                    break;
            }
        }

        return $coordinates;
    }


    /**
     * EPSG:3857 -> WGS84.
     */
    private function convertCoordinates(
        array $coordinates
    ): array {

        foreach ($coordinates as $i => $coordinate) {

            $converted = [
                $this->xToWGS84($coordinate[0]),
                $this->yToWGS84($coordinate[1]),
            ];

            // Сохраняем M (линейную меру), если она есть
            if (isset($coordinate[2])) {
                $converted[] = $coordinate[2];
            }

            $coordinates[$i] = $converted;
        }

        return $coordinates;
    }

    /**
     * EPSG:3857 X -> longitude.
     */
    private function xToWGS84(float $x): float
    {
        return ($x * 180) / 20037508.34;
    }


    /**
     * EPSG:3857 Y -> latitude.
     */
    private function yToWGS84(float $y): float
    {
        $lat = ($y * 180) / 20037508.34;

        return (180 / M_PI) *
            (
                2 * atan(exp(($lat * M_PI) / 180))
                - M_PI / 2
            );
    }
}