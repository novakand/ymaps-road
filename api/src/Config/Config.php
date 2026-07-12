<?php

declare(strict_types=1);

namespace RouteGIS\Config;

use RuntimeException;

final readonly class Config
{
    public function __construct(
        public RgisConfig $rgis,
        public SkdfConfig $skdf,
        public GeoServerConfig $geoserver,
    ) {
    }

    public static function load(string $path): self
    {
        if (!file_exists($path)) {
            throw new RuntimeException(
                "Configuration file not found: {$path}"
            );
        }

        $config = require $path;

        return new self(

            new RgisConfig(
                url: $config['rgis']['url'],
                contentProfile: $config['rgis']['content_profile'],
                timeout: $config['rgis']['timeout'] ?? 30,
            ),

            new SkdfConfig(
                url: $config['skdf']['url'],
                token: $config['skdf']['token'],
                timeout: $config['skdf']['timeout'] ?? 30,
            ),

            new GeoServerConfig(
                url: $config['geoserver']['url'],
                timeout: $config['geoserver']['timeout'] ?? 30,
            ),
        );
    }
}