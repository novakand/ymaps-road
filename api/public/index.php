<?php

declare(strict_types=1);

use RouteGIS\Config\Config;
use RouteGIS\Http\CurlClient;
use RouteGIS\Services\AxleLoadService;
use RouteGIS\Services\GeometryService;
use RouteGIS\Services\RgisService;
use RouteGIS\Services\RoadAxleService;
use RouteGIS\Services\RoadDetailsService;
use RouteGIS\Services\RoadLayerService;
use RouteGIS\Services\RoadSelectionService;
use RouteGIS\Services\RouteFilterService;
use RouteGIS\Services\SkdfService;

header('Content-Type: application/json; charset=utf-8');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require dirname(__DIR__) . '/vendor/autoload.php';

$config = Config::load(
    dirname(__DIR__) . '/config/config.php'
);

$http = new CurlClient();

$rgis = new RgisService($http, $config);
$skdf = new SkdfService($http, $config);
$geometry = new GeometryService();

$routeFilter = new RouteFilterService($geometry);
$axleLoad = new AxleLoadService();

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
                $skdf,
                $geometry
            );

            $result = $service->findRoadByPoint(
                longitude: (float)($payload['longitude'] ?? 0),
                latitude: (float)($payload['latitude'] ?? 0),
                zoom: (int)($payload['zoom'] ?? 16)
            );

            break;

        case '/road-axle':

            $service = new RoadAxleService(
                $rgis,
                $skdf,
                $routeFilter,
                $axleLoad,
                $geometry
            );

            $result = $service->analyze(
                routeFeatures: $payload['route_features'] ?? [],
                bounds3857: $payload['bounds'] ?? [],
                zoom: (int)($payload['zoom'] ?? 10)
            );

            break;

        case '/road-details':

            $service = new RoadDetailsService(
                $rgis,
                $skdf
            );

            $result = $service->getRoadDetails(
                $payload['road'] ?? []
            );

            break;

        case '/road-layer':

            $service = new RoadLayerService(
                $rgis
            );

            $result = $service->getTile(
                x: (int)($payload['x'] ?? 0),
                y: (int)($payload['y'] ?? 0),
                z: (int)($payload['z'] ?? 0)
            );

            break;

        default:

            http_response_code(404);

            $result = [
                'success' => false,
                'message' => 'Route not found'
            ];
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
