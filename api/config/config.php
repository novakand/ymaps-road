<?php

declare(strict_types=1);

return [

    'rgis' => [

        'url' => 'https://xn--d1aluo.xn--p1ai/api-pg/rpc/get_road_lr_geobox',

        'content_profile' => 'gis_api_public',

        'timeout' => 30,

    ],

    'skdf' => [

        'url' => 'https://xn--d1aluo.xn--p1ai/service-api-go/api/v1/developer/dataset/export',

        'token' => '53f17f86792977ea450659e822b32887bb84ca1b01b6ac4375dd3f193cdc34d5',

        'timeout' => 30,

    ],

    'geoserver' => [

        'url' => 'https://xn--d1aluo.xn--p1ai/api-geoserver/skdf_open/wfs',

        'timeout' => 30,

    ],

];
