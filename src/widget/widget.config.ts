import {
    ApplicationConfig,
    importProvidersFrom,
    LOCALE_ID,
    provideZoneChangeDetection,
} from '@angular/core';

import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import {
    provideHttpClient,
    HTTP_INTERCEPTORS,
} from '@angular/common/http';

import {
    provideYConfig,
    YConfig
} from 'angular-yandex-maps-v3';

import { routes } from '../app/app.routes';
import { Noir } from '../app/app-theme';

import { ErrorInterceptor } from '../app/interceptors/http-error.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { WIDGET_YANDEX_CONFIG } from './widget.tokens';
import { WidgetYandexConfig } from './widget-config.interface';


export function createWidgetConfig(
    config: WidgetYandexConfig
): ApplicationConfig {

    const yConfig: YConfig = {
        apikey: config.mapsApiKey,
        lang: config.lang ?? 'ru_RU'
    };

    return {
        providers: [

            {
                provide: WIDGET_YANDEX_CONFIG,
                useValue: config
            },

            provideYConfig(yConfig),

            {
                provide: LOCALE_ID,
                useValue: 'en-GB'
            },
            provideZoneChangeDetection({
                eventCoalescing: true
            }),
            providePrimeNG({
                ripple: true,
                theme: {
                    preset: Noir,
                    options: {
                        cssLayer: {
                            name: 'primeng',
                            order: 'theme, base, primeng'
                        },
                        darkModeSelector: '.p-dark'
                    }
                }
            }),

            provideHttpClient(),

            importProvidersFrom(
                BrowserAnimationsModule,
                ToastModule
            ),

            provideRouter(
                routes,
                withComponentInputBinding()
            ),
        ]
    };
}