import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

import { WidgetComponent } from './widget.component';
import { createWidgetConfig } from './widget.config';
import { YandexConfigService } from '../app/components/maps/services/yandex-config.service';

(async () => {

    const host =
        document.querySelector(
            'ymaps-widget'
        );

    const config = {

        mapsApiKey:
            host?.getAttribute(
                'maps-api-key'
            ) ?? '',

        suggestApiKey:
            host?.getAttribute(
                'suggest-api-key'
            ) ?? '',

        geocoderApiKey:
            host?.getAttribute(
                'geocoder-api-key'
            ) ?? '',

        assetsBaseUrl:
            host?.getAttribute(
                'assets-base-url'
            ) ?? '',


        apiBaseUrl:
            host?.getAttribute(
                'api-base-url'
            ) ?? '',

        lang:
            host?.getAttribute(
                'lang'
            ) as any ?? 'ru_RU'

    };

    const app =
        await createApplication(
            createWidgetConfig(
                config
            )
        );

    const yandexConfig =
        app.injector.get(
            YandexConfigService
        );

    yandexConfig.setConfig({

        mapsApiKey:
            config.mapsApiKey,

        suggestApiKey:
            config.suggestApiKey,

        geocoderApiKey:
            config.geocoderApiKey,

        apiBaseUrl: config.apiBaseUrl

    });

    const element =
        createCustomElement(
            WidgetComponent,
            {
                injector:
                    app.injector
            }
        );

    if (
        !customElements.get(
            'ymaps-widget'
        )
    ) {

        customElements.define(
            'ymaps-widget',
            element
        );

    }

})();