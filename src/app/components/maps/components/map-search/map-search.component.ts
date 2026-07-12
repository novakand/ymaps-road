import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, Subject, takeUntil, switchMap, of, catchError, BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MapService } from '../../services/map-service';
import { MapSearchService } from '../../services/map-search.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
    selector: 'map-search-control',
    standalone: true,
    templateUrl: './map-search.component.html',
    styleUrls: ['./map-search.component.scss'],
    imports: [CommonModule, FormsModule, AutoCompleteModule, InputGroupAddonModule, InputGroupModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapSearchComponent implements OnDestroy {

    @Output() locationSelected = new EventEmitter<any>();
    @Output() locationCleared = new EventEmitter<void>();

    private _map?: any;
    private _destroy$ = new Subject<void>();
    public suggestions$ = new BehaviorSubject<any>(null);
    private search$ = new Subject<string>();
    value: any;

    constructor(
        private _mapService: MapService,
        private _searchService: MapSearchService,
        private _cdr: ChangeDetectorRef
    ) {

        this._watchForLoadChanges();
    }

    private _watchForLoadChanges() {
        this._mapService.load$
            .pipe(
                filter(Boolean),
                takeUntil(this._destroy$),
            )
            .subscribe((mapInstance: any) => {
                this._map = mapInstance;
                this._watchSearch();


            });
    }


    private _watchSearch(): void {
        this.search$
            .pipe(
                switchMap(query =>
                    this._searchService.suggest(query)
                ),
                catchError(() => of([])),
                takeUntil(this._destroy$)
            )
            .subscribe(results => {

                this.suggestions$.next([...results]);
            });
    }

    onSearch(event: { query: string }) {
        this.search$.next(event.query);
    }


    onSelect(item: any) {
        if (!item || !this._map) return;

        this._searchService
            .geocode(item.uri || item.label)
            .subscribe(coordinates => {
                if (!coordinates) return;

                this.locationSelected.emit({ coordinates: coordinates, label: item.label });

                this._map.update({
                    location: {
                        center: coordinates,
                        zoom: 12,
                        duration: 400
                    }
                });
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }
}