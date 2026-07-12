<?php

declare(strict_types=1);

namespace RouteGIS\Config;

final readonly class RgisConfig
{
    public function __construct(
        public string $url,
        public string $contentProfile,
        public int $timeout = 30,
    ) {
    }
}