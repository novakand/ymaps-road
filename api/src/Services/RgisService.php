<?php

declare(strict_types=1);

namespace RouteGIS\Services;

use RouteGIS\Config\Config;
use RouteGIS\Http\CurlClient;

final readonly class RgisService
{
    public function __construct(
        private CurlClient $http,
        private Config $config,
    ) {
    }

    public function getRoadGeobox(
        array $box,
        int $scaleFactor = 1,
        int $zoom = 17,
    ): array {

        return $this->http->post(
            url: $this->config->rgis->url,

            payload: [
                'p_box' => $box,
                'p_scale_factor' => $scaleFactor,
                'p_zoom' => $zoom,
            ],

            headers: [
                'Content-Profile: ' . $this->config->rgis->contentProfile,
            ],

            timeout: $this->config->rgis->timeout,
        );
    }
}