import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapSearchService } from '../../../services/map-search.service';
import { IDirectionPoint } from '../interfaces/direction-state.interface';


@Injectable({
    providedIn: 'root'
})
export class GeocoderService {

    constructor(
        private mapSearchService: MapSearchService
    ) { }

    public resolvePoint(
        point: IDirectionPoint
    ): Observable<IDirectionPoint> {

        // Уже есть координаты — ничего делать не нужно
        if (point.coordinates?.length === 2) {
            return of(point);
        }

        // Нет текста — тоже выходим
        if (!point.label?.trim()) {
            return of(point);
        }

        return this.mapSearchService
            .geocode(point.label)
            .pipe(
                map(coords => {
                    if (!coords) {
                        return point;
                    }

                    return {
                        ...point,
                        value: coords,
                        coordinates: coords
                    };

                })
            );
    }

}