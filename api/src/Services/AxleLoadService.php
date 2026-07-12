<?php

declare(strict_types=1);

namespace RouteGIS\Services;

final class AxleLoadService
{
    /**
     * Определяет ограничение СКДФ для конкретного интервала M-координат подсегмента
     *
     * @param float $subStartM     Начало подсегмента (в метрах от начала дороги)
     * @param float $subEndM       Конец подсегмента (в метрах от начала дороги)
     * @param array $restrictions  Массив ограничений СКДФ для ДАННОЙ части дороги (road_part_id)
     * @return array               Массив со свойствами цвета и максимальной нагрузки
     */
    public function resolveRestrictionsForInterval(
        float $subStartM,
        float $subEndM,
        array $restrictions
    ): array {
        $activeSegment = null;

        // Центр текущего подсегмента в метрах (лучшая точка для замера ограничения)
        $middleM = ($subStartM + $subEndM) / 2;

        foreach ($restrictions as $segment) {
            // Переводим километраж СКДФ формата "123+456" в чистые метры
            $startM = $this->kmToMeters($segment['start'] ?? '');
            $finishM = $this->kmToMeters($segment['finish'] ?? '');

            $min = min($startM, $finishM);
            $max = max($startM, $finishM);

            // Честно проверяем, попадает ли центр нашего подсегмента в зону действия ограничения СКДФ
            if ($middleM >= $min && $middleM <= $max) {
                $activeSegment = $segment;
                break;
            }
        }

        // Фоллбэк 1: если точка строго между брейкпоинтами не зацепилась, берём первое ограничение этой дороги
        if ($activeSegment === null && !empty($restrictions)) {
            $activeSegment = $restrictions[0];
        }

        // Извлекаем допустимую нагрузку на ось
        // Структура СКДФ обычно хранит число в поле 'name' объекта осей 'os' (например, 10 или 11.5)
        $maxAxleLoad = (float) (
            $activeSegment['os']['name']
            ?? $activeSegment['max_axle_load']
            ?? 11.5 // Ведомственный дефолт для федеральных трасс РФ
        );

        return [
            'max_axle_load' => $maxAxleLoad,
            'km_start' => $activeSegment['start'] ?? null,
            'km_finish' => $activeSegment['finish'] ?? null,
            'road_name' => $activeSegment['road_name'] ?? null,
            'statusColor' => $this->resolveColor($maxAxleLoad),
        ];
    }

    /**
     * Модифицированный конвертер: "123+456" -> 123456.0 (в метры)
     * Позволяет выполнять точные целочисленные и float сравнения без погрешностей округления долей км
     */
    private function kmToMeters(string $value): float
    {
        if ($value === '') {
            return 0;
        }

        $parts = explode('+', $value);

        $km = (float) ($parts[0] ?? 0);
        $meters = (float) ($parts[1] ?? 0);

        return ($km * 1000) + $meters;
    }

    /**
     * Цвет ограничения на основе нагрузки (Сохраняем вашу палитру Tailwind)
     */
    public function resolveColor(float $axleLoad): string
    {
        // До 6 тонн — критический перегруз (Красный)
        if ($axleLoad <= 6.0) {
            return '#EF4444';
        }

        // До 10 тонн — умеренное ограничение (Оранжевый)
        if ($axleLoad <= 10.0) {
            return '#F59E0B';
        }

        // 11.5 тонн и выше — свободный проезд (Зеленый)
        return '#22C55E';
    }
}