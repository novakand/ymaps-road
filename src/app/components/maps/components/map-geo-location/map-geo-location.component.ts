import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    OnDestroy,
    Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MapService } from '../../services/map-service';
import { MapSearchService } from '../../services/map-search.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';


@Component({
    selector: 'map-geo-location-control',
    standalone: true,
    templateUrl: './map-geo-location.component.html',
    styleUrls: ['./map-geo-location.component.scss'],
    imports: [CommonModule, FormsModule, ButtonModule, InputGroupAddonModule, InputGroupModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapGeoLocationComponent implements OnDestroy {

    @Output() locationSelected = new EventEmitter<any>();

    private _map?: any;

    private _destroy$ =
        new Subject<void>();

    constructor(
        private _mapService: MapService,
        private _searchService: MapSearchService
    ) {

        this._watchForLoadChanges();

    }

    private _watchForLoadChanges(): void {

        this._mapService.load$
            .pipe(
                filter(Boolean),
                takeUntil(this._destroy$)
            )
            .subscribe((mapInstance: any) => {

                this._map = mapInstance;
                this.detectLocation();

            });

    }

    public detectLocation(): void {

        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(

            position => {

                const coordinates: [number, number] = [
                    position.coords.longitude,
                    position.coords.latitude
                ];

                this._searchService
                    .reverseGeocode(coordinates)
                    .subscribe(result => {

                        if (!result) {
                            return;
                        }

                        this.locationSelected.emit({
                            coordinates: result
                        });

                        this._map?.update({
                            location: {
                                center: result,
                                zoom: 12,
                                duration: 400
                            }
                        });

                    });

            },

            error => {
                console.error(error);
            },

            {
                enableHighAccuracy: true,
                timeout: 10000
            }

        );

    }

    ngOnDestroy(): void {

        this._destroy$.next();
        this._destroy$.complete();

    }

}