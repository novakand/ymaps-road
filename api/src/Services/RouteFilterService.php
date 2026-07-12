<?php

declare(strict_types=1);

namespace RouteGIS\Services;

final readonly class RouteFilterService
{
    public function __construct(
        private GeometryService $geometry,
    ) {
    }

    /**
     * Оставить только дороги, пересекающие или находящиеся вблизи активного чанка маршрута.
     * Полностью защищён от гигантских склеенных LineString/MultiLineString.
     *
     * @param array $roadsFeatures      Дороги РГИС (GeoJSON Features в EPSG:3857)
     * @param array $routeFeatures      GeoJSON чанка маршрута (в WGS84 из Яндекс)
     * @param float $maxDistance        Максимальный радиус коридора (в метрах)
     */
    public function filter(
        array $roadsFeatures,
        array $routeFeatures,
        float $maxDistance = 400.0, // Оптимизировано под точные загородные чанки (400м — идеальный загородный буфер)
    ): array {
        if (empty($roadsFeatures) || empty($routeFeatures)) {
            return [];
        }

        // 1. Собираем координаты активного чанка маршрута и ищем его Bounding Box (WGS84)
        $routeCoordinates = [];
        $minX = INF;
        $maxX = -INF;
        $minY = INF;
        $maxY = -INF;

        foreach ($routeFeatures as $feature) {
            if (!isset($feature['geometry'])) {
                continue;
            }

            $geometry = $feature['geometry'];
            $coordsToProcess = [];

            if ($geometry['type'] === 'LineString') {
                $coordsToProcess = $geometry['coordinates'];
            } elseif ($geometry['type'] === 'MultiLineString') {
                foreach ($geometry['coordinates'] as $line) {
                    $coordsToProcess = array_merge($coordsToProcess, $line);
                }
            }

            foreach ($coordsToProcess as $coordinate) {
                $routeCoordinates[] = $coordinate;

                // Ищем экстремумы для Bounding Box чанка Яндекса
                if ($coordinate[0] < $minX)
                    $minX = $coordinate[0];
                if ($coordinate[0] > $maxX)
                    $maxX = $coordinate[0];
                if ($coordinate[1] < $minY)
                    $minY = $coordinate[1];
                if ($coordinate[1] > $maxY)
                    $maxY = $coordinate[1];
            }
        }

        if (empty($routeCoordinates)) {
            return $roadsFeatures;
        }

        // Конвертация дорог РГИС EPSG:3857 -> WGS84 (Сохраняем WGS84 на выходе для совместимости с вашей системой!)
        $roads = $this->geometry->convertFeatures($roadsFeatures);

        // 2. Расширяем Bounding Box чанка маршрута на $maxDistance (переводим метры в градусы)
        $midLatitude = ($minY + $maxY) / 2;
        $deltaY = $maxDistance / 111000.0;
        $deltaX = $maxDistance / (111000.0 * cos(deg2rad($midLatitude)));

        $bboxMinX = $minX - $deltaX;
        $bboxMaxX = $maxX + $deltaX;
        $bboxMinY = $minY - $deltaY;
        $bboxMaxY = $maxY + $deltaY;

        // 3. Оставляем только дороги, реально проходящие сквозь коридор чанка
        return array_values(
            array_filter(
                $roads,
                function (array $road) use ($routeCoordinates, $maxDistance, $bboxMinX, $bboxMaxX, $bboxMinY, $bboxMaxY): bool {
                    try {
                        $geometry = $road['geometry'] ?? null;
                        if (!$geometry) {
                            return false;
                        }

                        // ИСПРАВЛЕНИЕ: Выпрямляем ВСЮ длинную геометрию трассы в один плоский массив координат
                        $allRoadPoints = [];
                        if ($geometry['type'] === 'LineString') {
                            $allRoadPoints = $geometry['coordinates'];
                        } elseif ($geometry['type'] === 'MultiLineString') {
                            foreach ($geometry['coordinates'] as $line) {
                                $allRoadPoints = array_merge($allRoadPoints, $line);
                            }
                        }

                        if (empty($allRoadPoints)) {
                            return false;
                        }

                        // --- ШАГ А: Честная проверка Bounding Box по ВСЕМ узлам дороги ---
                        // Ищем только те узлы длинной трассы, которые физически легли ВНУТРЬ BBox нашего чанка
                        $isPossiblyClose = false;
                        $matchedPoints = [];

                        foreach ($allRoadPoints as $point) {
                            if (
                                $point[0] >= $bboxMinX && $point[0] <= $bboxMaxX &&
                                $point[1] >= $bboxMinY && $point[1] <= $bboxMaxY
                            ) {
                                $isPossiblyClose = true;
                                $matchedPoints[] = $point; // Запоминаем эту локальную точку для замера точной дистанции
                            }
                        }

                        // Если ни один узел длинной трассы даже близко не пересёк BBox чанка маршрута, отбрасываем
                        if (!$isPossiblyClose) {
                            return false;
                        }

                        // --- ШАГ Б: Точный расчёт расстояния по локальным точкам ---
                        // Проверяем точное тригонометрическое расстояние до трека Яндекса по ВСЕМ точкам, 
                        // которые зашли в BBox чанка на этом перегоне. Больше никаких пропусков!
                        foreach ($matchedPoints as $checkPoint) {
                            $distance = $this->geometry->pointToLineDistance(
                                $checkPoint,
                                $routeCoordinates
                            );

                            if ($distance < $maxDistance) {
                                return true; // Точка загородного перегона совпала! Пропускаем длинную дорогу целиком
                            }
                        }

                        return false;

                    } catch (\Throwable) {
                        return false;
                    }
                }
            )
        );
    }
}