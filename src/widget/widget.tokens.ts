import { InjectionToken } from '@angular/core';
import { WidgetYandexConfig } from './widget-config.interface';

export const WIDGET_YANDEX_CONFIG =
    new InjectionToken<WidgetYandexConfig>(
        'WIDGET_YANDEX_CONFIG'
    );