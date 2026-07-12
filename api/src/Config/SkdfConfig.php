<?php

declare(strict_types=1);

namespace RouteGIS\Config;

final readonly class SkdfConfig
{
    public function __construct(
        public string $url,
        public string $token,
        public int $timeout = 30,
    ) {
    }
}