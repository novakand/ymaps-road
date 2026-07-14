<?php

declare(strict_types=1);

use RouteGIS\Config\Config;
use RouteGIS\Http\CurlClient;
use RouteGIS\Services\GeometryService;
use RouteGIS\Services\RgisService;
use RouteGIS\Services\RoadSelectionService;
use RouteGIS\Services\RoadAxleService;
use RouteGIS\Services\RoadBboxService;
header('Content-Type: application/json; charset=utf-8');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}


$apiDir = rtrim(realpath(__DIR__ . '/..'));

require $apiDir . '/vendor/autoload.php';

$config = Config::load(
    $apiDir . '/config/config.php'
);

$http = new CurlClient();

$rgis = new RgisService($http, $config);
$geometry = new GeometryService();

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = '/' . basename($path);

$payload = json_decode(
    file_get_contents('php://input'),
    true
) ?? [];

try {

    switch ($path) {

        case '/road-select':

            $service = new RoadSelectionService(
                $rgis,
                $geometry,
                $http
            );

            $result = $service->findRoadByPoint(
                longitude: (float) ($payload['longitude'] ?? 0),
                latitude: (float) ($payload['latitude'] ?? 0),
                zoom: (int) ($payload['zoom'] ?? 16)
            );

            break;

        case '/road-axle':
            $service = new RoadAxleService($http);
            $result = $service->analyze(
                routeFeatures: $payload['route_features'] ?? [],
                bounds4326: $payload['bounds'] ?? [],
                zoom: (int) ($payload['zoom'] ?? 14),
                chunkIndex: (int) ($payload['chunkIndex'] ?? 0),
            );
            break;


        case '/road-bbox':
            $service = new RoadBboxService($http);

            $bounds = $payload['bounds'] ?? [37.5, 55.5, 37.8, 55.8];
            $layers = $payload['layers'] ?? null;
            $zoom = (int) ($payload['zoom'] ?? 14);

            $result = $service->getLayersByBbox(
                bounds4326: $bounds,
                layers: $layers,
                zoom: $zoom
            );
            break;

        default:

            http_response_code(404);

            $result = [
                'success' => false,
                'message' => 'Route not found',
                'path' => $path
            ];

            break;

    }

} catch (Throwable $e) {

    http_response_code(500);

    $result = [
        'success' => false,
        'message' => $e->getMessage()
    ];
}

echo json_encode(
    $result,
    JSON_UNESCAPED_UNICODE |
    JSON_UNESCAPED_SLASHES
);