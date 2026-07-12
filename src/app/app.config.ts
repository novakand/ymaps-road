import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { Noir } from './app-theme';
import { ToastModule } from 'primeng/toast';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient } from '@angular/common/http';
import localeEnGb from '@angular/common/locales/en-GB';
import { registerLocaleData } from '@angular/common';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ErrorInterceptor } from './interceptors/http-error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideYConfig, YConfig } from 'angular-yandex-maps-v3';
const config: YConfig = {
  apikey: 'f3d86a8b-3fca-4a99-8e07-c4260e6e4dbc',
  lang: 'ru_RU'
};

import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocalizationService } from './services/localization.service';

registerLocaleData(localeEnGb);
export const appConfig: ApplicationConfig = {
  providers: [
    provideYConfig(config),
    { provide: LOCALE_ID, useValue: 'en-GB' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'ru',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    TranslateService,
    TranslateStore,
    LocalizationService,
    importProvidersFrom(BrowserModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
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
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(BrowserAnimationsModule, ToastModule),
    {
      provide: 'BASE_HREF',
      useFactory: () => {
        const baseElement = document.querySelector('base');
        return baseElement ? baseElement.getAttribute('href') || '/' : '/';
      }
    }
  ]
};
