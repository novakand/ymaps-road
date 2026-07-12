<?php

declare(strict_types=1);

namespace RouteGIS\Services;

final readonly class RoadDetailsService
{
    public function __construct(
        private SkdfService $skdf,
        private AxleLoadService $axleLoad,
        private GeometryService $geometry,
    ) {
    }

    /**
     * Получить детальную информацию о выбранной дороге.
     *
     * @param array $road GeoJSON Feature
     */
    public function getDetails(
        array $road,
    ): array {

        $roadId = (int) (
            $road['properties']['road_id'] ?? 0
        );

        if ($roadId <= 0) {

            return [
                'road' => null,
                'axleRoads' => [],
                'axleLoads' => [],
                'speedLimits' => [],
                'bridges' => [],
                'repairs' => [],
                'weightStations' => [],
            ];
        }

        // Получаем ограничения СКДФ
        $axleLoads = $this->skdf->getAxleLoads([
            $roadId
        ]);

        // Добавляем информацию об ограничениях
        $axleRoads = $this->axleLoad->applyAxleLoads(
            [$road],
            $axleLoads,
        );

        // Разбиваем MultiLineString на отдельные LineString
        $features = [];

        foreach ($axleRoads as $feature) {

            $features = array_merge(
                $features,
                $this->geometry->explodeFeature($feature)
            );
        }

        return [

            'road' => $road,

            'axleRoads' => $features,

            'axleLoads' => $axleLoads,

            // Зарезервировано под будущие данные
            'speedLimits' => [],
            'bridges' => [],
            'repairs' => [],
            'weightStations' => [],

        ];
    }
}