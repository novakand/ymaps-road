import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { YandexConfigService } from './yandex-config.service';

@Injectable({
    providedIn: 'root'
})
export class GeoService {



    constructor(private http: HttpClient,
        private config: YandexConfigService
    ) { }


    private get api(): any {
        return this.config.value.apiBaseUrl;
    }

    selectRoad(
        longitude: number,
        latitude: number,
        zoom: number
    ): Observable<any> {

        return this.http.post<any>(
            `${this.api}/road-select`,
            {
                longitude,
                latitude,
                zoom
            }
        );
    }

    getRoadDetails(road: any): Observable<any> {
        return this.http.post<any>(
            `${this.api}/road-details`,
            { road }
        );
    }

    getRoadAxle(
        routeFeatures: any[],
        bounds: number[],
        zoom: number
    ): Observable<any> {

        return this.http.post<any>(
            `${this.api}/road-axle`,
            {
                route_features: routeFeatures,
                bounds,
                zoom
            }
        );
    }

    getRoadLayerTile(
        x: number,
        y: number,
        z: number
    ): Observable<any> {

        return this.http.post<any>(
            `${this.api}/road-layer`,
            { x, y, z }
        );
    }
}