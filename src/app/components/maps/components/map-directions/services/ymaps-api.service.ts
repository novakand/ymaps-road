import { Injectable } from "@angular/core";
import { YandexConfigService } from "../../../services/yandex-config.service";

@Injectable({
    providedIn: 'root'
})
export class YandexApiLoaderService {

    private promise?: Promise<any>;

    constructor(
        private config: YandexConfigService
    ) { }

    load(): Promise<any> {

        if ((window as any).ymaps) {
            return Promise.resolve((window as any).ymaps);
        }

        if (this.promise) {
            return this.promise;
        }

        this.promise = new Promise((resolve, reject) => {

            const script = document.createElement('script');

            script.src =
                `https://api-maps.yandex.ru/2.1/` +
                `?apikey=${this.config.value.mapsApiKey}` +
                `&lang=ru_RU` +
                `&coordorder=longlat`; // Or 'latlong' depending on your preference

            script.async = true;

            script.onload = () => {

                (window as any).ymaps.ready(() => {

                    resolve((window as any).ymaps);

                });

            };

            script.onerror = reject;

            document.head.appendChild(script);

        });

        return this.promise;

    }

}