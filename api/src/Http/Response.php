<?php

declare(strict_types=1);

namespace RouteGIS\Http;

final class Response
{
    /**
     * Отправить JSON-ответ.
     */
    public static function json(
        mixed $data,
        int $statusCode = 200
    ): never {

        http_response_code($statusCode);

        header('Content-Type: application/json; charset=utf-8');

        echo json_encode(
            $data,
            JSON_UNESCAPED_UNICODE |
            JSON_UNESCAPED_SLASHES
        );

        exit;
    }

    /**
     * Успешный ответ.
     */
    public static function success(
        mixed $data = null,
        string $message = 'OK'
    ): never {

        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }

    /**
     * Ответ с ошибкой.
     */
    public static function error(
        string $message,
        int $statusCode = 400,
        mixed $errors = null
    ): never {

        self::json([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], $statusCode);
    }
}