<?php

declare(strict_types=1);

namespace RouteGIS\Services;

use RouteGIS\Http\CurlClient;

final readonly class RoadSelectionService
{
    private const EARTH_CIRCUMFERENCE = 20037508.34;

    private const WFS_BASE_URL =
        'https://xn--d1aluo.xn--p1ai/api-geoserver/skdf_open/wfs';

    private const WFS_PAGE_SIZE = 1000;
    private const WFS_MAX_PAGES = 100;
    private const CLICK_RADIUS_METERS = 50.0;

    private const WFS_LAYERS = [
        'lyr_road_conditions_os_6' => 6.0,
        'lyr_road_conditions_os_10' => 10.0,
        'lyr_road_conditions_os_11_5' => 11.5,
    ];

    public function __construct(
        private RgisService $rgis,
        private GeometryService $geometry,
        private CurlClient $http,
    ) {
    }

    public function findRoadByPoint(
        float $longitude,
        float $latitude,
        int $zoom = 16,
    ): array {
        $nearestRoad = $this->findNearestRoad(
            longitude: $longitude,
            latitude: $latitude,
            zoom: $zoom,
        );

        if ($nearestRoad === null) {
            return $this->createEmptyFeatureCollection();
        }

        $properties = $nearestRoad['properties'] ?? [];
        $roadId = (int) ($properties['road_id'] ?? 0);

        if ($roadId <= 0) {
            return $this->createEmptyFeatureCollection();
        }

        $roadName = (string) (
            $properties['road_name']
            ?? 'без названия'
        );

        $distance = (float) (
            $nearestRoad['_click_distance']
            ?? INF
        );

        error_log(sprintf(
            'CLICK NEAREST road_id=%d road="%s" distance=%.2fm',
            $roadId,
            $roadName,
            $distance,
        ));

        $features = $this->getWfsRoadFeatures($roadId);

        error_log(sprintf(
            'CLICK RESULT road_id=%d road="%s" features=%d',
            $roadId,
            $roadName,
            count($features),
        ));

        return [
            'type' => 'FeatureCollection',
            'features' => $features,
        ];
    }


    private function createEmptyFeatureCollection(): array
    {
        return [
            'type' => 'FeatureCollection',
            'features' => [],
        ];
    }
    private function findNearestRoad(
        float $longitude,
        float $latitude,
        int $zoom,
    ): ?array {
        $latOffset = self::CLICK_RADIUS_METERS / 110540.0;

        $longitudeMeters = cos(deg2rad($latitude)) * 111320.0;

        if (abs($longitudeMeters) < 0.000001) {
            return null;
        }

        $lngOffset = self::CLICK_RADIUS_METERS / $longitudeMeters;

        $min = $this->wgs84To3857(
            $longitude - $lngOffset,
            $latitude - $latOffset,
        );

        $max = $this->wgs84To3857(
            $longitude + $lngOffset,
            $latitude + $latOffset,
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

        $rawFeatures = $roadsResponse['features'] ?? [];

        error_log(sprintf(
            'CLICK RGIS lon=%.7f lat=%.7f zoom=%d radius=%.1fm raw_features=%d',
            $longitude,
            $latitude,
            $zoom,
            self::CLICK_RADIUS_METERS,
            count($rawFeatures),
        ));

        if (empty($rawFeatures)) {
            return null;
        }

        $roads = $this->geometry->convertFeatures($rawFeatures);

        if (empty($roads)) {
            error_log('CLICK RGIS: GeometryService returned no features');
            return null;
        }

        $nearestRoad = null;
        $minDistance = INF;

        foreach ($roads as $road) {
            $geometry = $road['geometry'] ?? null;

            if (
                !is_array($geometry) ||
                !isset($geometry['type'], $geometry['coordinates'])
            ) {
                continue;
            }

            $lines = $this->extractGeometryLines($geometry);

            foreach ($lines as $line) {
                if (count($line) < 2) {
                    continue;
                }

                $distance = $this->geometry->pointToLineDistance(
                    [$longitude, $latitude],
                    $line,
                );

                if (!is_finite($distance)) {
                    continue;
                }

                if ($distance < $minDistance) {
                    $minDistance = $distance;
                    $nearestRoad = $road;
                }
            }
        }

        if ($nearestRoad === null) {
            return null;
        }

        $nearestRoad['_click_distance'] = $minDistance;

        return $nearestRoad;
    }

    private function getWfsRoadFeatures(int $roadId): array
    {
        $result = [];

        foreach (self::WFS_LAYERS as $layer => $maxAxleLoad) {
            $layerFeatures = $this->fetchRoadLayer(
                layer: $layer,
                roadId: $roadId,
                maxAxleLoad: $maxAxleLoad,
            );

            foreach ($layerFeatures as $feature) {
                $result[] = $feature;
            }
        }

        usort(
            $result,
            static function (array $left, array $right): int {
                $leftProperties = $left['properties'] ?? [];
                $rightProperties = $right['properties'] ?? [];

                $partComparison =
                    ((int) ($leftProperties['part_id'] ?? 0))
                    <=>
                    ((int) ($rightProperties['part_id'] ?? 0));

                if ($partComparison !== 0) {
                    return $partComparison;
                }

                $startComparison =
                    ((float) ($leftProperties['start_km'] ?? 0.0))
                    <=>
                    ((float) ($rightProperties['start_km'] ?? 0.0));

                if ($startComparison !== 0) {
                    return $startComparison;
                }

                return
                    ((float) ($leftProperties['max_axle_load'] ?? 0.0))
                    <=>
                    ((float) ($rightProperties['max_axle_load'] ?? 0.0));
            },
        );

        return $result;
    }

    private function fetchRoadLayer(
        string $layer,
        int $roadId,
        float $maxAxleLoad,
    ): array {
        $result = [];
        $startIndex = 0;
        $page = 0;

        while ($page < self::WFS_MAX_PAGES) {
            $response = $this->http->get(
                self::WFS_BASE_URL,
                [
                    'SERVICE' => 'WFS',
                    'VERSION' => '2.0.0',
                    'REQUEST' => 'GetFeature',
                    'TYPENAME' => 'skdf_open:' . $layer,
                    'OUTPUTFORMAT' => 'application/json',
                    'SRSNAME' => 'EPSG:4326',
                    'CQL_FILTER' => sprintf('road_id=%d', $roadId),
                    'COUNT' => self::WFS_PAGE_SIZE,
                    'STARTINDEX' => $startIndex,
                    'SORTBY' => 'part_id A,start_km A',
                ],
            );

            $features = $response['features'] ?? [];

            if (!is_array($features)) {
                $features = [];
            }

            $returned = count($features);

            $numberMatched = $this->resolveNumberMatched(
                response: $response,
                returned: $returned,
            );

            error_log(sprintf(
                'CLICK WFS road_id=%d layer=%s page=%d offset=%d returned=%d matched=%d',
                $roadId,
                $layer,
                $page,
                $startIndex,
                $returned,
                $numberMatched,
            ));

            foreach ($features as $featureIndex => $feature) {
                if (!is_array($feature)) {
                    continue;
                }

                $geometry = $feature['geometry'] ?? null;

                if (
                    !is_array($geometry) ||
                    empty($this->extractGeometryLines($geometry))
                ) {
                    error_log(sprintf(
                        'CLICK WFS SKIP road_id=%d layer=%s feature_index=%d: invalid geometry',
                        $roadId,
                        $layer,
                        $featureIndex,
                    ));

                    continue;
                }

                $properties = $feature['properties'] ?? [];

                if (!is_array($properties)) {
                    $properties = [];
                }

                $feature['properties'] = array_merge(
                    $properties,
                    [
                        'max_axle_load' => $maxAxleLoad,
                        'load_category' => $maxAxleLoad . 't',
                        'statusColor' => $this->resolveStatusColor(
                            $maxAxleLoad,
                        ),
                        'source_layer' => $layer,
                    ],
                );

                $sourceFeatureId = (string) (
                    $feature['id']
                    ?? $properties['id']
                    ?? ($startIndex + $featureIndex)
                );

                $feature['id'] = sprintf(
                    '%s-%d-%s',
                    $layer,
                    $roadId,
                    $sourceFeatureId,
                );

                $result[] = $feature;
            }

            if ($returned === 0) {
                break;
            }

            $startIndex += $returned;
            $page++;

            if (
                $returned < self::WFS_PAGE_SIZE ||
                $startIndex >= $numberMatched
            ) {
                break;
            }
        }

        if ($page >= self::WFS_MAX_PAGES) {
            error_log(sprintf(
                'CLICK WFS WARNING road_id=%d layer=%s: max pages reached',
                $roadId,
                $layer,
            ));
        }

        error_log(sprintf(
            'CLICK WFS DONE road_id=%d layer=%s features=%d',
            $roadId,
            $layer,
            count($result),
        ));

        return $result;
    }
    private function extractGeometryLines(array $geometry): array
    {
        $type = $geometry['type'] ?? null;
        $coordinates = $geometry['coordinates'] ?? null;

        if (!is_array($coordinates)) {
            return [];
        }

        return match ($type) {
            'LineString' => count($coordinates) >= 2
            ? [$coordinates]
            : [],
            'MultiLineString' => array_values(
                array_filter(
                    $coordinates,
                    static fn(mixed $line): bool =>
                    is_array($line) &&
                    count($line) >= 2,
                ),
            ),
            default => [],
        };
    }

    private function resolveNumberMatched(
        array $response,
        int $returned,
    ): int {
        $value =
            $response['numberMatched']
            ?? $response['totalFeatures']
            ?? null;

        if (is_int($value) || is_float($value)) {
            return max((int) $value, $returned);
        }

        if (is_string($value) && is_numeric($value)) {
            return max((int) $value, $returned);
        }

        return $returned === self::WFS_PAGE_SIZE
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

    private function wgs84To3857(
        float $longitude,
        float $latitude,
    ): array {

        $latitude = max(
            -85.05112878,
            min(85.05112878, $latitude),
        );

        $x =
            $longitude *
            self::EARTH_CIRCUMFERENCE /
            180.0;

        $y = log(
            tan(
                (90.0 + $latitude) *
                M_PI /
                360.0,
            ),
        ) / (M_PI / 180.0);

        $y =
            $y *
            self::EARTH_CIRCUMFERENCE /
            180.0;

        return [$x, $y];
    }
}