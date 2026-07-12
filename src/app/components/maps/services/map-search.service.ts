import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { SelectedLocation } from '../interfaces/location.interface';
import { YandexConfigService } from './yandex-config.service';

@Injectable({
    providedIn: 'root'
})
export class MapSearchService {


    constructor(private http: HttpClient,
        private yandexConfig: YandexConfigService) { }

    suggest(
        text: string,
        bounds?: [[number, number], [number, number]],
        types: string = 'geo,biz',
        limit: number = 10
    ): Observable<any[]> {

        const params: any = {
            apikey: this.yandexConfig.value.suggestApiKey,
            text,
            types,
            results: limit
        };

        if (bounds) {
            const [sw, ne] = bounds;
            params.bbox = `${sw[0]},${sw[1]}~${ne[0]},${ne[1]}`;
        }

        return this.http
            .get<any>('https://suggest-maps.yandex.ru/v1/suggest', { params })
            .pipe(
                map(res =>
                    (res.results || []).map((item: any) => {

                        const title = item.title?.text || '';
                        const subtitle = item.subtitle?.text || '';

                        return {
                            label: subtitle
                                ? `${title}, ${subtitle}`
                                : title,
                            rawLabel: title,
                            subtitle,
                            uri: item.uri
                        };
                    })
                )
            );
    }

    geocode(query: string): Observable<[number, number] | null> {

        if (!query?.trim()) {
            return of(null);
        }

        const params = {
            apikey: this.yandexConfig.value.geocoderApiKey,
            format: 'json',
            geocode: query,
            results: 1
        };

        return this.http
            .get<any>(
                'https://geocode-maps.yandex.ru/1.x/',
                { params }
            )
            .pipe(

                map(res => {

                    const feature =
                        res?.response?.GeoObjectCollection
                            ?.featureMember?.[0]?.GeoObject;

                    if (!feature?.Point?.pos) {
                        return null;
                    }

                    const [lon, lat] =
                        feature.Point.pos
                            .split(' ')
                            .map(Number);

                    const label =
                        feature.metaDataProperty
                            ?.GeocoderMetaData
                            ?.text ?? query;

                    return [lon, lat] as [number, number];

                }),

                catchError(() => of(null))
            );
    }

    reverseGeocode(
        coordinates: [number, number]
    ): Observable<[number, number] | null> {

        const params = {
            apikey: this.yandexConfig.value.geocoderApiKey,
            format: 'json',
            geocode: coordinates.join(','),
            results: 1
        };

        return this.http
            .get<any>(
                'https://geocode-maps.yandex.ru/1.x/',
                { params }
            )
            .pipe(

                tap(res => {

                    const feature =
                        res?.response?.GeoObjectCollection
                            ?.featureMember?.[0]?.GeoObject;

                    const label =
                        feature?.metaDataProperty
                            ?.GeocoderMetaData
                            ?.text ?? '';



                }),

                map(() => coordinates),

                catchError(() => of(null))
            );
    }

}