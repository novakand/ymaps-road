import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, Subject, takeUntil, debounceTime, switchMap, from, of, catchError, BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { MapService } from '../../services/map-service';
import { MapSearchService } from '../../services/map-search.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'map-geocoding-control',
    standalone: true,
    templateUrl: './map-geocoding.component.html',
    styleUrls: ['./map-geocoding.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputTextModule,
        ButtonModule,
        InputGroupAddonModule,
        InputGroupModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapGeocodingComponent implements OnDestroy {

    @Output() locationCleared = new EventEmitter<void>();

    private _map?: any;
    private _destroy$ = new Subject<void>();
    private readonly _input$ = new Subject<string>();
    public value = '';

    constructor(
        private _searchService: MapSearchService,
        private _mapService: MapService,
        private _cdr: ChangeDetectorRef
    ) {

        this._watchLocation();
        this._watchInput();
        this._watchForLoadChanges();

    }

    private _watchLocation(): void {

        this._searchService.selectedLocation$
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe(location => {

                if (!location) {
                    this.value = '';
                    this._cdr.markForCheck();
                    return;
                }

                const [lon, lat] =
                    location.coordinates;

                this.value =
                    `${lat.toFixed(6)}, ${lon.toFixed(6)}`;

                this._cdr.markForCheck();

            });

    }

    private _watchForLoadChanges() {
        this._mapService.load$
            .pipe(
                filter(Boolean),
                takeUntil(this._destroy$),
            )
            .subscribe((mapInstance: any) => {
                this._map = mapInstance;

            });
    }

    private _watchInput(): void {

        this._input$
            .pipe(

                debounceTime(500),

                distinctUntilChanged(),

                takeUntil(
                    this._destroy$
                )

            )
            .subscribe(value => {

                const coordinates =
                    this.parseCoordinates(
                        value
                    );

                if (!coordinates) {
                    return;
                }

                this._map.update({
                    location: {
                        center: coordinates,
                        zoom: 12,
                        duration: 400
                    }
                });

                this._searchService
                    .reverseGeocode(
                        coordinates
                    )
                    .subscribe();

            });

    }

    public onInputChange(
        value: string
    ): void {

        this.value = value;

        this._input$.next(
            value
        );

    }


    public async copyCoordinates(): Promise<void> {

        if (!this.value) {
            return;
        }

        await navigator.clipboard.writeText(
            this.value
        );

    }


    private parseCoordinates(
        value: string
    ): [number, number] | null {

        const parts =
            value
                .trim()
                .split(/[,\s]+/);

        if (
            parts.length !== 2
        ) {
            return null;
        }

        const lat =
            Number(parts[0]);

        const lon =
            Number(parts[1]);

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon)
        ) {
            return null;
        }

        if (
            lat < -90 ||
            lat > 90 ||
            lon < -180 ||
            lon > 180
        ) {
            return null;
        }

        return [lon, lat];

    }

    public onClear(): void {

        this.value = '';

        this._searchService.selectedLocation$.next(null);
        this._searchService.dragLocation$.next(null);

        this.locationCleared.emit();

        this._cdr.markForCheck();

    }

    ngOnDestroy(): void {

        this._destroy$.next();
        this._destroy$.complete();

    }

}