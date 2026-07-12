<?php

declare(strict_types=1);

namespace RouteGIS\Http;

use RuntimeException;

final class Request
{
    /**
     * Получить JSON из тела запроса.
     */
    public static function json(): array
    {
        $content = file_get_contents('php://input');

        if ($content === false || $content === '') {
            throw new RuntimeException('Empty request body.');
        }

        $data = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException(json_last_error_msg());
        }

        return $data;
    }

    /**
     * Получить HTTP метод.
     */
    public static function method(): string
    {
        return $_SERVER['REQUEST_METHOD'] ?? 'GET';
    }

    /**
     * Проверка OPTIONS.
     */
    public static function isOptions(): bool
    {
        return self::method() === 'OPTIONS';
    }

    /**
     * Проверка POST.
     */
    public static function isPost(): bool
    {
        return self::method() === 'POST';
    }
}