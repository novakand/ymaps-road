<?php

declare(strict_types=1);

namespace RouteGIS\Services;

use RouteGIS\Http\CurlClient;

final readonly class RoadBboxService
{
    private const WFS_BASE_URL =
        'https://xn--d1aluo.xn--p1ai/api-geoserver/skdf_open/wfs';

    private const MAX_FEATURES = 1000;
    private const MAX_PAGES = 100;

    private const MAX_BBOX_SIZE_DEGREES = 1.0;

    private const LAYER_LOAD_MAP = [
        'lyr_road_conditions_os_6' => 6.0,
        'lyr_road_conditions_os_10' => 10.0,
        'lyr_road_conditions_os_11_5' => 11.5,
    ];

    public function __construct(
        private CurlClient $http,
    ) {
    }

    public function getLayersByBbox(
        array $bounds4326,
        ?array $layers = null,
        int $zoom = 14,
    ): array {
        $bounds4326 = $this->normalizeBounds($bounds4326);

        if ($bounds4326 === null) {
            error_log('ROAD BBOX: invalid bounds');

            return $this->createEmptyFeatureCollection(
                bounds: [],
                zoom: $zoom,
            );
        }

        $bounds4326 = $this->limitBoundsSize($bounds4326);

        $layersToLoad = $this->resolveLayers($layers);

        if (empty($layersToLoad)) {
            return $this->createEmptyFeatureCollection(
                bounds: $bounds4326,
                zoom: $zoom,
            );
        }

        error_log(sprintf(
            'ROAD BBOX START bounds=[%s] zoom=%d layers=%s',
            implode(', ', $bounds4326),
            $zoom,
            json_encode($layersToLoad),
        ));

        $allFeatures = [];

        foreach ($layersToLoad as $layer) {
            $load = self::LAYER_LOAD_MAP[$layer];

            $features = $this->fetchLayer(
                layer: $layer,
                bounds4326: $bounds4326,
            );

            foreach ($features as $featureIndex => $feature) {
                if (!is_array($feature)) {
                    continue;
                }

                $geometry = $feature['geometry'] ?? null;

                if (!$this->isSupportedGeometry($geometry)) {
                    error_log(sprintf(
                        'ROAD BBOX SKIP layer=%s index=%d: invalid geometry',
                        $layer,
                        $featureIndex,
                    ));

                    continue;
                }

                $properties = $feature['properties'] ?? [];

                if (!is_array($properties)) {
                    $properties = [];
                }

                $sourceId = (string) (
                    $feature['id']
                    ?? $properties['id']
                    ?? $featureIndex
                );

                $feature['id'] = sprintf(
                    '%s-%s',
                    $layer,
                    $sourceId,
                );

                $feature['properties'] = array_merge(
                    $properties,
                    [
                        'os' => $load,
                        'max_axle_load' => $load,
                        'load_category' => $load . 't',
                        'source_layer' => $layer,
                        'strokeColor' => $this->resolveStatusColor($load),
                        'strokeWidth' => 8,
                        'strokeOpacity' => 0.9,
                        'hintContent' => $this->getHintContent($load),
                    ],
                );

                $allFeatures[] = $feature;
            }

            error_log(sprintf(
                'ROAD BBOX LAYER layer=%s loaded=%d',
                $layer,
                count($features),
            ));
        }

        error_log(sprintf(
            'ROAD BBOX RESULT features=%d bounds=[%s] zoom=%d',
            count($allFeatures),
            implode(', ', $bounds4326),
            $zoom,
        ));

        return [
            'type' => 'FeatureCollection',
            'features' => $allFeatures,
            'totalFeatures' => count($allFeatures),
            'bounds' => $bounds4326,
            'zoom' => $zoom,
        ];
    }

    private function fetchLayer(
        string $layer,
        array $bounds4326,
    ): array {
        $allFeatures = [];
        $startIndex = 0;
        $page = 0;
        $bbox = implode(',', $bounds4326) . ',EPSG:4326';

        while ($page < self::MAX_PAGES) {
            $params = [
                'SERVICE' => 'WFS',
                'VERSION' => '2.0.0',
                'REQUEST' => 'GetFeature',
                'TYPENAME' => 'skdf_open:' . $layer,
                'OUTPUTFORMAT' => 'application/json',
                'SRSNAME' => 'EPSG:4326',
                'BBOX' => $bbox,
                'COUNT' => self::MAX_FEATURES,
                'STARTINDEX' => $startIndex,
                'SORTBY' => 'road_id A,start_km A',
            ];

            try {
                $response = $this->http->get(
                    self::WFS_BASE_URL,
                    $params,
                );
            } catch (\Throwable $exception) {
                error_log(sprintf(
                    'ROAD BBOX ERROR layer=%s page=%d offset=%d message="%s"',
                    $layer,
                    $page,
                    $startIndex,
                    $exception->getMessage(),
                ));

                break;
            }

            $features = $response['features'] ?? [];

            if (!is_array($features)) {
                $features = [];
            }

            $returned = count($features);

            if ($returned === 0) {
                break;
            }

            $allFeatures = array_merge(
                $allFeatures,
                $features,
            );

            $numberMatched = $this->resolveNumberMatched(
                response: $response,
                returned: $returned,
            );

            error_log(sprintf(
                'ROAD BBOX PAGE layer=%s page=%d offset=%d returned=%d matched=%d',
                $layer,
                $page,
                $startIndex,
                $returned,
                $numberMatched,
            ));

            $startIndex += $returned;
            $page++;

            if (
                $returned < self::MAX_FEATURES ||
                $startIndex >= $numberMatched
            ) {
                break;
            }
        }

        if ($page >= self::MAX_PAGES) {
            error_log(sprintf(
                'ROAD BBOX WARNING layer=%s: max pages reached',
                $layer,
            ));
        }

        return $allFeatures;
    }

    private function normalizeBounds(array $bounds): ?array
    {
        if (count($bounds) < 4) {
            return null;
        }

        foreach (array_slice($bounds, 0, 4) as $value) {
            if (!is_numeric($value)) {
                return null;
            }
        }

        $west = (float) $bounds[0];
        $south = (float) $bounds[1];
        $east = (float) $bounds[2];
        $north = (float) $bounds[3];

        if ($west > $east) {
            [$west, $east] = [$east, $west];
        }

        if ($south > $north) {
            [$south, $north] = [$north, $south];
        }

        $west = max(-180.0, min(180.0, $west));
        $east = max(-180.0, min(180.0, $east));
        $south = max(-90.0, min(90.0, $south));
        $north = max(-90.0, min(90.0, $north));

        if (
            abs($east - $west) < 0.0000001 ||
            abs($north - $south) < 0.0000001
        ) {
            return null;
        }

        return [
            $west,
            $south,
            $east,
            $north,
        ];
    }

    private function limitBoundsSize(array $bounds): array
    {
        [$west, $south, $east, $north] = $bounds;

        $width = $east - $west;
        $height = $north - $south;

        if (
            $width <= self::MAX_BBOX_SIZE_DEGREES &&
            $height <= self::MAX_BBOX_SIZE_DEGREES
        ) {
            return $bounds;
        }

        $centerLongitude = ($west + $east) / 2.0;
        $centerLatitude = ($south + $north) / 2.0;

        $halfWidth = min(
            $width,
            self::MAX_BBOX_SIZE_DEGREES,
        ) / 2.0;

        $halfHeight = min(
            $height,
            self::MAX_BBOX_SIZE_DEGREES,
        ) / 2.0;

        $limited = [
            $centerLongitude - $halfWidth,
            $centerLatitude - $halfHeight,
            $centerLongitude + $halfWidth,
            $centerLatitude + $halfHeight,
        ];

        error_log(sprintf(
            'ROAD BBOX TRUNCATED original=[%s] limited=[%s]',
            implode(', ', $bounds),
            implode(', ', $limited),
        ));

        return $limited;
    }

    private function resolveLayers(?array $layers): array
    {
        if ($layers === null || empty($layers)) {
            return array_keys(self::LAYER_LOAD_MAP);
        }

        $result = [];

        foreach ($layers as $layer) {
            if (!is_string($layer)) {
                continue;
            }

            if (!isset(self::LAYER_LOAD_MAP[$layer])) {
                error_log(sprintf(
                    'ROAD BBOX: unknown layer "%s"',
                    $layer,
                ));

                continue;
            }

            $result[] = $layer;
        }

        return array_values(
            array_unique($result),
        );
    }

    private function isSupportedGeometry(mixed $geometry): bool
    {
        if (
            !is_array($geometry) ||
            !isset($geometry['type'], $geometry['coordinates']) ||
            !is_array($geometry['coordinates'])
        ) {
            return false;
        }

        return in_array(
            $geometry['type'],
            [
                'LineString',
                'MultiLineString',
            ],
            true,
        );
    }

    private function resolveNumberMatched(
        array $response,
        int $returned,
    ): int {
        $numberMatched =
            $response['numberMatched']
            ?? $response['totalFeatures']
            ?? null;

        if (
            is_int($numberMatched) ||
            is_float($numberMatched)
        ) {
            return max(
                (int) $numberMatched,
                $returned,
            );
        }

        if (
            is_string($numberMatched) &&
            is_numeric($numberMatched)
        ) {
            return max(
                (int) $numberMatched,
                $returned,
            );
        }

        return $returned === self::MAX_FEATURES
            ? PHP_INT_MAX
            : $returned;
    }

    private function resolveStatusColor(float $axleLoad): string
    {
        if ($axleLoad <= 6.0) {
            return '#EF4444';
        }

        if ($axleLoad <= 10.0) {
            return '#F59E0B';
        }

        return '#22C55E';
    }

    private function getHintContent(float $axleLoad): string
    {
        if ($axleLoad <= 6.0) {
            return '⚠️ Критическое ограничение (≤ 6 т)';
        }

        if ($axleLoad <= 10.0) {
            return '⚠️ Ограничение (6–10 т)';
        }

        return '✅ Проезд разрешен (> 10 т)';
    }

    private function createEmptyFeatureCollection(
        array $bounds,
        int $zoom,
    ): array {
        return [
            'type' => 'FeatureCollection',
            'features' => [],
            'totalFeatures' => 0,
            'bounds' => $bounds,
            'zoom' => $zoom,
        ];
    }
}