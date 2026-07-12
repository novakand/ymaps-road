<?php

declare(strict_types=1);

namespace RouteGIS\Services;

use RouteGIS\Config\Config;
use RouteGIS\Http\CurlClient;

final readonly class GeoServerService
{
    public function __construct(
        private CurlClient $http,
        private Config $config,
    ) {
    }

    /**
     * Получить участок дороги по road_part_id.
     */
    public function getRoadPartById(
        int $roadPartId,
    ): array {

        return $this->http->get(
            url: $this->config->geoserver->url,
            query: [
                'service' => 'WFS',
                'version' => '2.0.0',
                'request' => 'GetFeature',
                'typeNames' => 'skdf_open:zoom_1_roads_old',
                'outputFormat' => 'application/json',
                'srsName' => 'EPSG:4326',
                'cql_filter' => "road_part_id={$roadPartId}",
            ],
            timeout: $this->config->geoserver->timeout,
        );

    }
}