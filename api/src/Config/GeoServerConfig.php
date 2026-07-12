<?php

declare(strict_types=1);

namespace RouteGIS\Config;

final readonly class GeoServerConfig
{
    public function __construct(
        public string $url,
        public int $timeout = 30,
    ) {
    }
}