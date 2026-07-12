<?php

declare(strict_types=1);

namespace RouteGIS\Http;

use JsonException;
use RuntimeException;

final class CurlClient
{

    /**
     * Выполняет GET-запрос.
     *
     * @param string $url
     * @param array $query
     * @param array $headers
     * @param int $timeout
     *
     * @return array
     *
     * @throws RuntimeException
     * @throws JsonException
     */
    public function get(
        string $url,
        array $query = [],
        array $headers = [],
        int $timeout = 30,
    ): array {

        if (!empty($query)) {
            $url .= '?' . http_build_query($query);
        }

        $curl = curl_init($url);

        $httpHeaders = array_merge(
            [
                'Accept: application/json',
                'User-Agent: RouteGIS/1.0',
            ],
            $headers
        );

        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $httpHeaders,
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_CONNECTTIMEOUT => 10,
        ]);

        $response = curl_exec($curl);

        if ($response === false) {

            $error = curl_error($curl);

            curl_close($curl);

            throw new RuntimeException($error);
        }

        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);

        if ($httpCode < 200 || $httpCode >= 300) {
            throw new RuntimeException(
                "HTTP {$httpCode}: {$response}"
            );
        }

        $data = json_decode(
            $response,
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        if (!is_array($data)) {
            throw new RuntimeException(sprintf(
                'Expected array from %s, got: %s',
                $url,
                $response
            ));
        }

        return $data;
    }
    /**
     * Выполняет POST-запрос.
     *
     * @param string $url
     * @param array $payload
     * @param array $headers
     * @param int $timeout
     *
     * @return array
     *
     * @throws RuntimeException
     * @throws JsonException
     */
    public function post(
        string $url,
        array $payload,
        array $headers = [],
        int $timeout = 30,
    ): array {

        $curl = curl_init($url);

        $httpHeaders = array_merge(
            [
                'Content-Type: application/json',
                'Accept: application/json',
                'User-Agent: RouteGIS/1.0',
            ],
            $headers
        );

        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode(
                $payload,
                JSON_THROW_ON_ERROR
                | JSON_UNESCAPED_UNICODE
                | JSON_UNESCAPED_SLASHES
            ),
            CURLOPT_HTTPHEADER => $httpHeaders,
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_CONNECTTIMEOUT => 10,
        ]);

        $response = curl_exec($curl);

        if ($response === false) {

            $error = curl_error($curl);

            curl_close($curl);

            throw new RuntimeException($error);
        }

        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);

        if ($httpCode < 200 || $httpCode >= 300) {
            throw new RuntimeException(
                "HTTP {$httpCode}: {$response}"
            );
        }

        $data = json_decode(
            $response,
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        if (!is_array($data)) {
            throw new RuntimeException(sprintf(
                'Expected array from %s, got: %s. Payload: %s',
                $url,
                $response,
                json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
            ));
        }

        return $data;
    }
}