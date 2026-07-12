<?php

declare(strict_types=1);

namespace RouteGIS\Services;

use RouteGIS\Config\Config;
use RouteGIS\Http\CurlClient;

final readonly class SkdfService
{
    public function __construct(
        private CurlClient $http,
        private Config $config,
    ) {
    }

    /**
     * Получить ограничения нагрузки на ось с защитой от рассинхронизации ID и таймаутов.
     *
     * @param int[] $roadIds           Идентификаторы дорог
     * @param int[] $valueOfRoadGids   Категории значения дорог (федеральные/региональные)
     * @param int[] $regionGids        Коды регионов (субъектов РФ)
     */
    public function getAxleLoads(array $roadIds, array $valueOfRoadGids = [], array $regionGids = []): array
    {
        $payload = [
            'dataset_code' => 'axle-load',
            'road_ids' => array_values(array_unique($roadIds)),
        ];

        // Подмешиваем категории дорог, если они определились в РГИС чанке
        if (!empty($valueOfRoadGids)) {
            $payload['value_of_the_road_gids'] = array_values(array_unique($valueOfRoadGids));
        }

        // Подмешиваем регионы, чтобы СКДФ не искала по всей России и мгновенно отдавала ответ
        if (!empty($regionGids)) {
            $payload['region_gids'] = array_values(array_unique($regionGids));
        }

        return $this->http->post(
            url: $this->config->skdf->url,
            payload: $payload,
            headers: [
                'X-External-System-Token: ' . $this->config->skdf->token,
            ],
            timeout: $this->config->skdf->timeout,
        );
    }
}
