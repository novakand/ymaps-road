// map.component.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, inject, NgZone, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { deepEquals } from "@primeuix/utils";
import * as turf from "@turf/turf";
import length from '@turf/length';
import {
    YMapComponent,
    YMapDefaultSchemeLayerDirective,
    YMapDefaultFeaturesLayerDirective,
    YMapListenerDirective,
} from 'angular-yandex-maps-v3';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { MapSidebarComponent } from './components/map-sidebar/map-sidebar.component';
import { MapZoomControlComponent } from './components/map-zoom-control/map-zoom-control.component';
import { MapFullscreenComponent } from './components/map-fullscreen/map-fullscreen.component';
import { MapSettingsControlComponent } from './components/map-settings-control/map-settings-control.component';
import { MapService } from './services/map-service';
import { BehaviorSubject, catchError, combineLatest, concatMap, debounceTime, delay, distinctUntilChanged, EMPTY, filter, finalize, from, map, of, Subject, switchMap, takeUntil, tap, timeout, timer, withLatestFrom } from 'rxjs';
import { MapEventManager } from './services/map-event-manager';
import { YMapFeatureDirective } from './directives/y-map-feature.directive';
import { YMapFeatureDataSourceDirective } from './directives/y-map-feature-data-source.directive';
import { YMapLayerDirective } from './directives/y-map-layer.directive';
import { MapLegendControlComponent } from './components/map-legend-control/map-legend-control.component';
import { YMapClustererDirective } from './directives/y-map-clusterer.directive';
import { LayoutService } from '../../services/layout.service';
import { YMapMouseDirective } from './directives/y-map-mouse.directive';
import { MapSearchComponent } from './components/map-search/map-search.component';
import { YMapMarkerDirective } from './directives/y-map-marker.directive';
import { YMapHintDirective } from './directives/y-map-hint.directive';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { YMapSatelliteLayerDirective } from './directives/ymap-satelite-layer.directive';
import { YMapTileDataSourceDirective } from './directives/y-map-tile-data-source.directive';
import { DirectionStateService } from './components/map-directions/services/direction-state.service';
import { GeoService } from './services/geo-service';
import { MapLayerControlComponent } from './components/map-layer-control/map-layer-control.component';
import { LoadProgressService } from '../../services/load-progress.service';
import { LayerStateService } from './services/layer-state.service';
import { RoadSelectionStateService } from './services/road-selection.service';
import simplify from '@turf/simplify';
import { lineString, point } from '@turf/helpers';
import lineChunk from '@turf/line-chunk';
import bbox from '@turf/bbox';
import bearing from '@turf/bearing';
interface RouteChunk {
    bounds: number[];
    features: any[];
}
@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ChipModule,
        SkeletonModule,
        MapSidebarComponent,
        MapZoomControlComponent,
        MapSettingsControlComponent,
        MapSearchComponent,
        MapFullscreenComponent,
        YMapComponent,
        YMapDefaultSchemeLayerDirective,
        YMapDefaultFeaturesLayerDirective,
        YMapFeatureDirective,
        YMapLayerDirective,
        MapLegendControlComponent,
        YMapClustererDirective,
        YMapMarkerDirective,
        YMapMouseDirective,
        YMapHintDirective,
        YMapSatelliteLayerDirective,
        YMapFeatureDataSourceDirective,
        YMapTileDataSourceDirective,
        MapLayerControlComponent,
        YMapListenerDirective
    ],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {
    public center = signal<[number, number]>([37.617698, 55.755864]);
    public zoom = signal<number>(3);
    public theme = signal<'light' | 'dark'>('light');
    public basemap = signal<any>('scheme');
    public isDraggingAddress = false;
    public bounds = signal<[[number, number], [number, number]]>([[-83.8, -170.8], [83.8, 170.8]]);
    public zoomRange = signal({ min: 3, max: 19 });
    public isMapLoad = false;
    private map?: any;
    public isVisible = false;
    public encodeURIComponent = encodeURIComponent;
    public isVisibleSidebarBottom = false;
    public isSmallScreen: boolean;
    public stepMarkerFeature: any = null;
    public isLargeScreen: boolean;
    private currentChunkIndex = 0;
    public activeBeamId: string | null = null;
    public fullscreenClass = 'layout-map-container';
    public directionFeatures: any[] = [];
    public directionMarkerFeatures: any[] = [];
    public activeDirectionFeatures: any[] = [];
    public rgisRoadFeatures = signal<any[]>([]);
    private readonly chunkFeatures =
        signal(new Map<number, any[]>());
    public axleLoadFeatures = computed(() => {

        return Array
            .from(this.chunkFeatures().values())
            .flat();

    });
    public roadSelectionFeatures = signal<any[]>([]);
    public roadBboxFeatures = signal<any[]>([]);
    private readonly _analyzeRoute$ = new Subject<{
        chunks: RouteChunk[];
        zoom: number;
    }>();
    private readonly CHUNK_LENGTH_KM = 15;
    private readonly CHUNK_PADDING_METERS = 300;
    private readonly CHUNK_REQUEST_DELAY_MS = 300;
    private readonly CHUNK_REQUEST_TIMEOUT_MS = 30000;
    private readonly online$ = this.layerStateService.layers$.pipe(
        map(layers => layers.axle),
        distinctUntilChanged()
    );
    @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;
    public setBasemap(v: any) { this.basemap.set(v); }

    public schemeProps: any = {
        source: 'scheme',
        visible: true,
        layers: {
            ground: { zIndex: 1500 },
            labels: { zIndex: 2000 },
            icons: { zIndex: 2050 },
            buildings: { zIndex: 1600 },
        },
        customization: {
            style: [
                {
                    tags: { any: ['land', 'landcover', 'terrain', 'landscape', 'admin', 'transit'] },
                    elements: 'geometry', stylers: [{ opacity: 0 }]
                },

                {
                    tags: { any: ['building'] },
                    elements: 'geometry', stylers: [{ opacity: 0 }]
                },

                { tags: { any: ['water'] }, elements: 'geometry', stylers: [{ opacity: 0 }] },
            ]
        }
    };
    roadSelectionAxleFeatures = signal<any[]>([]);
    private _eventManager: MapEventManager = new MapEventManager(inject(NgZone));
    private _bounds = this._eventManager.getLazyEmitter<{
        object: any;
        event: {
            location: {
                bounds: any;
            };
        };
    }>('onUpdate');
    private zoom$ = new BehaviorSubject<number>(this.zoom());
    private bounds$ = new BehaviorSubject<any | null>(null);
    private _destroy$ = new Subject<boolean>();
    public layers = {
        intersections: true,
        active: true,
        axle: false,
        alternative: true,
        axleBbox: false,
    };

    constructor(
        public cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        public mapService: MapService,
        public layoutService: LayoutService,
        private breakpointObserver: BreakpointObserver,
        private directionState: DirectionStateService,
        private geoService: GeoService,
        private _loadProgressService: LoadProgressService,
        public layerStateService: LayerStateService,
        private roadSelectionState: RoadSelectionStateService,
    ) {

        this.theme.set(this.layoutService.config().darkTheme ? 'dark' : 'light');

        this.breakpointObserver
            .observe(['(min-width: 992px)', '(max-width: 767px)'])
            .pipe(delay(100))
            .subscribe((state: BreakpointState) => {
                this.isLargeScreen = state.breakpoints['(min-width: 992px)'];
                this.isSmallScreen = state.breakpoints['(max-width: 767px)'];
                this.cdr.detectChanges();
            });


        this.layerStateService.layers$
            .pipe(takeUntil(this._destroy$))
            .subscribe(layers => {

                this.layers = layers;

                this.cdr.markForCheck();

            });

        this.roadSelectionState.state$
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe(state => {

                if (!state.road?.length) {
                    this.roadSelectionFeatures.set([]);
                }

                this.cdr.markForCheck();

            });
    }

    public ngOnInit() { }

    public roadSourceProps = {
        id: 'skdf-roads-source',
        copyrights: ['© OpenRailwayMap contributors'],
        raster: {
            type: 'ground',
            size: 256,


            fetchTile: (x, y, z) => {

                return `http://localhost:8001/road-layer.php/${z}/${x}/${y}.png`;

            }
        },
        transparent: true,
        zoomRange: {
            min: 6,
            max: 24
        },
        clampMapZoom: false
    };



    public roadLayerProps = {
        source: 'skdf-roads-source',
        type: 'ground',
        zIndex: 2000,
        options: {
            raster: {
                awaitAllTilesOnFirstDisplay: true
            }
        }
    };

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();

        this._eventManager.setTarget(null);
        this.mapService.load$.next(null);

        this.map?.destroy?.();
        this.map = undefined;
        this.cdr.markForCheck();

    }

    public onMapReady(ev: { entity: any; ymaps3: typeof ymaps3 }) {
        this.map = ev.entity;
        this.isMapLoad = true;
        this.mapService.load$.next(this.map);
        this._eventManager.setTarget(this.map);
        this._watchBaseLayer();
        this._watchFoDarkThemeChanges();
        this._watchDirections();
        this._watchAnalyzeRoute();
        this._watchFocusedStep();
        this._watchHoveredStep();
        this._watchBboxChanges();
        this._watchMapLocationChanges();
        this._watchDirectionPoints();
        this.cdr.markForCheck();
    }


    public getContainerSize(): { width: number; height: number } {
        const element = this.mapContainer.nativeElement;
        return {
            width: element.clientWidth,
            height: element.clientHeight
        };
    }

    private buildRouteChunks(
        features: any[],
        chunkLengthKm = this.CHUNK_LENGTH_KM
    ): RouteChunk[] {
        const result: RouteChunk[] = [];

        for (const feature of features) {
            if (feature?.geometry?.type !== 'LineString') {
                continue;
            }

            try {
                const chunks = lineChunk(
                    lineString(feature.geometry.coordinates),
                    chunkLengthKm,
                    { units: 'kilometers' }
                );

                for (const chunk of chunks.features) {
                    const coordinates = chunk.geometry.coordinates;

                    if (!coordinates || coordinates.length < 2) {
                        continue;
                    }

                    const chunkDistanceMeters = length(chunk, { units: 'meters' });

                    const startPoint = point(coordinates[0]);
                    const endPoint = point(coordinates[coordinates.length - 1]);

                    let chunkAngle = bearing(startPoint, endPoint);

                    if (chunkAngle < 0) {
                        chunkAngle += 360;
                    }

                    let [minX, minY, maxX, maxY] = bbox(chunk);

                    const midLat = (minY + maxY) / 2;
                    const deltaY = this.CHUNK_PADDING_METERS / 111000;
                    const deltaX = this.CHUNK_PADDING_METERS / (111000 * Math.cos((midLat * Math.PI) / 180));

                    minX -= deltaX;
                    maxX += deltaX;
                    minY -= deltaY;
                    maxY += deltaY;

                    const enrichedFeature = {
                        ...feature,
                        geometry: chunk.geometry,
                        properties: {
                            ...(feature.properties || {}),
                            chunkDistance: chunkDistanceMeters,
                            chunkAngle: chunkAngle
                        }
                    };

                    result.push({
                        bounds: [minX, minY, maxX, maxY],
                        features: [enrichedFeature]
                    });
                }
            } catch (error) {
                console.error('Failed to split route chunk:', error);
            }
        }

        return result;
    }

    public getFeatureProperties(feature: any): any {
        if (!feature) return {};
        const props = feature.properties || {};

        return {
            ...props,
            hintTitle: props.road_name || 'Выбранный участок дороги',
            hintColor: props.strokeColor || '#191a1a',
            roadId: props.road_id,
            roadPartId: props.road_part_id,
            roadLength: props.road_length,
            startKm: props.start_km,
            roadValue: props.value_of_the_road,
            geometry: feature.geometry
        };
    }

    public onMapClick = (
        object: any,
        event: any,
    ): void => {

        const [longitude, latitude] = event.coordinates;

        this.geoService
            .selectRoad(
                longitude,
                latitude,
                Math.ceil(this.map.zoom)
            )
            .subscribe({

                next: response => {

                    if (!response) {

                        this.roadSelectionFeatures.set([]);

                        this.roadSelectionState.clear();
                        this.cdr.detectChanges();
                        return;
                    }
                    const features = response?.features ?? [];
                    this.roadSelectionState.setSelection(features);
                    this.roadSelectionFeatures.set(features);
                    this.cdr.detectChanges();
                },

                error: error => {

                    console.error(error);
                    this.roadSelectionFeatures.set([]);
                    this.roadSelectionState.clear();

                }

            });

    };

    private getStepCoordinate(step: GeoJSON.Feature): [number, number] | null {
        if (!step?.geometry) {
            return null;
        }

        switch (step.geometry.type) {
            case 'Point':
                return step.geometry.coordinates as [number, number];

            case 'LineString': {
                const coords = step.geometry.coordinates;
                if (coords.length === 0) {
                    return null;
                }
                return coords[0] as [number, number];
            }

            default:
                return null;
        }
    }

    private makeCircleIcon(
        color = '#ff3333',
        size = 24,
        stroke = '#ffffff',
        strokeWidth = 2,
        label?: string,
        labelColor = '#ffffff'
    ): { url: string } {

        const r = size / 2;
        const fontSize = Math.round(size * 0.55);

        const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${size}"
         height="${size}"
         viewBox="${-r} ${-r} ${size} ${size}">
        <circle
            cx="0"
            cy="0"
            r="${r - strokeWidth / 2}"
            fill="${color}"
            stroke="${stroke}"
            stroke-width="${strokeWidth}"
        />
        ${label
                ? `<text
                    x="0"
                    y="0"
                    text-anchor="middle"
                    dominant-baseline="central"
                    fill="${labelColor}"
                    font-family="Arial, sans-serif"
                    font-size="${fontSize}"
                    font-weight="bold">${label}</text>`
                : ''
            }
    </svg>
`;

        return {
            url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
        };
    }


    private _watchDirectionPoints(): void {
        this.directionState.state$
            .pipe(
                map(state => ({
                    origin: state.origin,
                    destination: state.destination,
                    waypoints: state.waypoints
                })),
                distinctUntilChanged((a, b) => deepEquals(a, b)),
                takeUntil(this._destroy$)
            )
            .subscribe(state => {

                const features: any[] = [];

                if (state.origin.coordinates) {

                    features.push({
                        source: 'direction-markers',
                        id: 'origin',
                        geometry: {
                            type: 'Point',
                            coordinates: state.origin.coordinates
                        },
                        properties: {
                            title: 'A'
                        },
                        style: {
                            icon: this.makeCircleIcon(
                                '#22C55E',
                                24,
                                '#FFFFFF',
                                2,
                                'A'
                            )
                        }
                    });

                }

                if (state.destination.coordinates) {
                    features.push({
                        source: 'direction-markers',
                        id: 'destination',
                        geometry: {
                            type: 'Point',
                            coordinates: state.destination.coordinates
                        },
                        properties: {
                            title: 'B'
                        },
                        style: {
                            icon: this.makeCircleIcon(
                                '#EF4444',
                                24,
                                '#FFFFFF',
                                2,
                                'B'
                            )
                        }
                    });

                }

                state.waypoints.forEach((point, index) => {

                    if (!point.coordinates) {
                        return;
                    }

                    features.push({
                        source: 'direction-markers',
                        id: `waypoint-${index}`,
                        geometry: {
                            type: 'Point',
                            coordinates: point.coordinates
                        },
                        properties: {
                            title: `${index + 1}`
                        },
                        style: {
                            icon: this.makeCircleIcon(
                                '#3B82F6',
                                22,
                                '#FFFFFF',
                                2,
                                `${index + 1}`
                            )
                        }
                    });

                });

                this.directionMarkerFeatures = features;

                this.cdr.markForCheck();

            });

    }

    private _watchFocusedStep(): void {

        this.directionState.state$
            .pipe(
                map(state => state.focusedStep),
                distinctUntilChanged(),
                takeUntil(this._destroy$)
            )
            .subscribe(step => {

                if (!this.map) {
                    return;
                }

                if (!step) {

                    this.stepMarkerFeature = null;

                    this.cdr.markForCheck();

                    return;

                }

                const coordinate = this.getStepCoordinate(step);


                if (!coordinate) {
                    return;
                }

                this.stepMarkerFeature = {
                    source: 'direction-markers',
                    id: 'focused-step',
                    geometry: {
                        type: 'Point',
                        coordinates: coordinate
                    },
                    style: {
                        icon: this.makeCircleIcon(
                            '#0B21E1',
                            18,
                            '#FFFFFF',
                            2
                        )
                    }
                };



                this.map.update({
                    location: {
                        center: coordinate,
                        zoom: 17,
                        duration: 600
                    }
                });

            });

    }


    private _watchHoveredStep(): void {
        this.directionState.state$
            .pipe(
                map(state => state.hoveredStep),
                distinctUntilChanged(),
                takeUntil(this._destroy$)
            )
            .subscribe(step => {
                if (!step) {
                    this.stepMarkerFeature = null;
                    this.cdr.markForCheck();
                    return;
                }

                const coordinate = this.getStepCoordinate(step);
                if (!coordinate) {
                    return;
                }

                this.stepMarkerFeature = {
                    geometry: {
                        type: 'Point',
                        coordinates: coordinate
                    }
                };

                this.cdr.markForCheck();
            });
    }

    private _watchAnalyzeRoute(): void {
        this._analyzeRoute$
            .pipe(
                switchMap(request =>
                    this.online$.pipe(
                        switchMap(isEnabled => {
                            if (
                                !isEnabled ||
                                request.chunks.length === 0
                            ) {
                                return EMPTY;
                            }

                            const missingChunkIndexes =
                                request.chunks
                                    .map((_, index) => index)
                                    .filter(index =>
                                        !this.chunkFeatures().has(index)
                                    );

                            if (missingChunkIndexes.length === 0) {
                                console.log(
                                    'ROAD AXLE: all chunks already loaded',
                                    {
                                        chunks:
                                            request.chunks.length,
                                        cached:
                                            this.chunkFeatures().size,
                                    },
                                );

                                return EMPTY;
                            }

                            this._loadProgressService.show(999);

                            return from(missingChunkIndexes).pipe(
                                concatMap(chunkIndex => {
                                    const chunk = request.chunks[chunkIndex];

                                    if (!chunk) {
                                        return EMPTY;
                                    }

                                    return timer(this.CHUNK_REQUEST_DELAY_MS).pipe(
                                        switchMap(() =>
                                            this.geoService
                                                .getRoadAxle(
                                                    chunk.features,
                                                    chunk.bounds,
                                                    request.zoom,
                                                    chunkIndex,
                                                )
                                                .pipe(
                                                    timeout(
                                                        this.CHUNK_REQUEST_TIMEOUT_MS,
                                                    ),

                                                    map(response => ({
                                                        response,
                                                        chunkIndex,
                                                    })),

                                                    catchError(error => {
                                                        console.error(
                                                            'ROAD AXLE ERROR',
                                                            {
                                                                chunkIndex,
                                                                error,
                                                            },
                                                        );

                                                        return of({
                                                            response: {
                                                                type: 'FeatureCollection',
                                                                features: [],
                                                            },
                                                            chunkIndex,
                                                        });
                                                    }),
                                                ),
                                        ),
                                    );
                                }),

                                tap(({ response, chunkIndex }) => {
                                    const features =
                                        response?.features ?? [];

                                    const cache = new Map(
                                        this.chunkFeatures(),
                                    );

                                    cache.set(
                                        chunkIndex,
                                        features,
                                    );

                                    this.chunkFeatures.set(cache);

                                    this.cdr.markForCheck();
                                }),

                                finalize(() => {
                                    this._loadProgressService.hide(999);
                                    this.cdr.markForCheck();
                                }),
                            );
                        }),
                    ),
                ),

                takeUntil(this._destroy$),
            )
            .subscribe({
                error: error => {
                    console.error(
                        'ROAD AXLE STREAM ERROR',
                        error,
                    );

                    this._loadProgressService.hide(999);
                    this.cdr.markForCheck();
                },
            });
    }

    private _watchBboxChanges(): void {
        combineLatest([
            this.bounds$,
            this.zoom$,
            this.layerStateService.layers$,
        ])
            .pipe(
                debounceTime(300),

                map(([bounds, zoom, layers]) => ({
                    bounds,
                    zoom,
                    enabled: Boolean(layers.axleBbox),
                })),

                distinctUntilChanged((previous, current) => (
                    previous.zoom === current.zoom &&
                    previous.enabled === current.enabled &&
                    deepEquals(previous.bounds, current.bounds)
                )),

                tap(state => {
                    if (
                        !state.enabled ||
                        !state.bounds ||
                        state.zoom < 12
                    ) {
                        this.roadBboxFeatures.set([]);
                        this._loadProgressService.hide(998);
                        this.cdr.markForCheck();
                    }
                }),

                switchMap(state => {
                    if (
                        !state.enabled ||
                        !state.bounds ||
                        state.zoom < 11
                    ) {
                        return EMPTY;
                    }

                    const bounds4326 = this._flattenBounds(
                        state.bounds,
                    );

                    this._loadProgressService.show(998);

                    return this.geoService
                        .getRoadBbox(
                            bounds4326,
                            null,
                            Math.ceil(state.zoom),
                        )
                        .pipe(
                            catchError(error => {
                                console.error(
                                    'ROAD BBOX LOAD ERROR',
                                    error,
                                );

                                return of({
                                    type: 'FeatureCollection',
                                    features: [],
                                });
                            }),

                            finalize(() => {
                                this._loadProgressService.hide(
                                    998,
                                );

                                this.cdr.markForCheck();
                            }),
                        );
                }),

                takeUntil(this._destroy$),
            )
            .subscribe(featureCollection => {
                this.roadBboxFeatures.set(
                    featureCollection?.features ?? [],
                );

                this.cdr.markForCheck();
            });
    }

    private _watchMapLocationChanges(): void {
        if (this.map?.bounds) {
            this.bounds$.next(this.map.bounds);
        }

        if (Number.isFinite(this.map?.zoom)) {
            this.zoom$.next(this.map.zoom);
        }

        this._bounds
            .pipe(
                takeUntil(this._destroy$),
            )
            .subscribe(update => {
                const eventBounds =
                    update?.event?.location?.bounds;

                const currentBounds =
                    eventBounds ??
                    this.map?.bounds ??
                    null;

                const currentZoom =
                    this.map?.zoom ?? null;

                if (currentBounds) {
                    this.bounds$.next(currentBounds);
                }

                if (
                    typeof currentZoom === 'number' &&
                    Number.isFinite(currentZoom)
                ) {
                    this.zoom$.next(currentZoom);
                }
            });
    }

    private _flattenBounds(
        bounds: [[number, number], [number, number]],
    ): [number, number, number, number] {
        const first = bounds[0];
        const second = bounds[1];

        const west = Math.min(first[0], second[0]);
        const east = Math.max(first[0], second[0]);

        const south = Math.min(first[1], second[1]);
        const north = Math.max(first[1], second[1]);

        return [
            west,
            south,
            east,
            north,
        ];
    }

    public getZoomFromBBox(bbox) {
        const { width, height } = this.getContainerSize();

        const turfBbox = [bbox[0][0], bbox[0][1], bbox[1][0], bbox[1][1]];
        const west = turf.point([turfBbox[0], (turfBbox[1] + turfBbox[3]) / 2]);
        const east = turf.point([turfBbox[2], (turfBbox[1] + turfBbox[3]) / 2]);
        const south = turf.point([(turfBbox[0] + turfBbox[2]) / 2, turfBbox[1]]);
        const north = turf.point([(turfBbox[0] + turfBbox[2]) / 2, turfBbox[3]]);
        const bboxWidthKm = turf.distance(west, east, { units: 'kilometers' });
        const bboxHeightKm = turf.distance(south, north, { units: 'kilometers' });
        const bboxWidthMeters = bboxWidthKm * 1000;
        const bboxHeightMeters = bboxHeightKm * 1000;

        const EARTH_CIRCUMFERENCE = 40075016.686;
        const TILE_SIZE = 256;
        const centerLat = (turfBbox[1] + turfBbox[3]) / 2;
        const latRad = (centerLat * Math.PI) / 180;
        const metersPerPixelAtZoom0 = (EARTH_CIRCUMFERENCE * Math.cos(latRad)) / TILE_SIZE;
        const zoomX = Math.log2((width * metersPerPixelAtZoom0) / bboxWidthMeters);
        const zoomY = Math.log2((height * metersPerPixelAtZoom0) / bboxHeightMeters);
        let exactZoom = Math.min(zoomX, zoomY);
        exactZoom = Math.max(0, Math.min(21, exactZoom));

        return exactZoom;
    }


    private simplifyRouteFeatures(features: any[]): any[] {
        return features.map(feature => {
            if (!feature || feature.geometry?.type !== 'LineString') {
                return feature;
            }

            try {
                const routeLengthKm = length(
                    feature.geometry,
                    { units: 'kilometers' }
                );

                const calculatedTolerance =
                    (routeLengthKm / 100) * 0.0001;

                const tolerance = Math.min(
                    0.0005,
                    Math.max(0.000005, calculatedTolerance)
                );

                const simplified = simplify(
                    {
                        type: 'Feature',
                        geometry: feature.geometry,
                        properties: {}
                    },
                    {
                        tolerance,
                        highQuality: false,
                        mutate: false
                    }
                );

                return {
                    ...feature,
                    geometry: simplified.geometry
                };

            } catch (error) {

                console.error(
                    'Failed to simplify feature',
                    error,
                    feature
                );

                return feature;
            }

        });

    }

    private _watchDirections(): void {
        this.directionState.state$
            .pipe(
                map(state => state.directions),
                distinctUntilChanged((a, b) => deepEquals(a, b)),

                tap(route => {
                    this.directionFeatures = [];
                    this.activeDirectionFeatures = [];
                    this.chunkFeatures.set(new Map());

                    if (!route) {

                        this.directionFeatures = [];
                        this.activeDirectionFeatures = [];
                        this.chunkFeatures.set(new Map());
                        this.cdr.markForCheck();

                        return;
                    }


                    for (const r of route.routes) {

                        const target = r.active
                            ? this.activeDirectionFeatures
                            : this.directionFeatures;

                        const style = r.active
                            ? {
                                stroke: [
                                    {
                                        color: '#0B21E1',
                                        width: 12,
                                        opacity: 1
                                    },
                                    {
                                        color: '#3B82F6',
                                        width: 6,
                                        opacity: 1
                                    }
                                ]
                            }
                            : {
                                stroke: [
                                    {
                                        color: '#6A83D7',
                                        width: 12,
                                        opacity: .8
                                    },
                                    {
                                        color: '#BCCEFB',
                                        width: 6,
                                        opacity: 1
                                    }
                                ]
                            };

                        target.push(
                            ...r.geoJson.features.map(
                                (feature: any, index: number) => ({
                                    id: `route-${r.index}-${index}`,
                                    geometry: feature.geometry,
                                    properties: feature.properties,
                                    style
                                })
                            )
                        );
                    }

                    const activeBounds =
                        this.buildBoundsFromGeoJSON(
                            this.activeDirectionFeatures
                        );

                    if (!activeBounds) {
                        return;
                    }

                    this.fitBounds(
                        this.buildBoundsFromGeoJSON([
                            ...this.directionFeatures,
                            ...this.activeDirectionFeatures
                        ])
                    );


                    this.currentChunkIndex = 0;
                    this.chunkFeatures.set(
                        new Map<number, any[]>()
                    );

                    this.rgisRoadFeatures.set([]);
                    this.roadSelectionFeatures.set([]);

                    const simplifiedFeatures =
                        this.simplifyRouteFeatures(
                            this.activeDirectionFeatures
                        );

                    const zoom = this.getZoomFromBBox(activeBounds);
                    const finalZoom = 12

                    const chunks =
                        this.buildRouteChunks(
                            simplifiedFeatures
                        );

                    this._analyzeRoute$.next({
                        chunks,
                        zoom: finalZoom
                    });

                    this.cdr.markForCheck();

                }),
                takeUntil(this._destroy$)

            )
            .subscribe({
                error: err => console.error(err)
            });
    }

    private _watchBaseLayer(): void {

        this.mapService.baseLayer$
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(this._destroy$)
            )
            .subscribe(layer => {
                this.setBasemap(layer)
            });
    }

    private buildBoundsFromGeoJSON(
        input:
            | GeoJSON.Feature
            | GeoJSON.Feature[]
            | GeoJSON.FeatureCollection
    ): [[number, number], [number, number]] | null {

        if (!input) return null;

        let featureCollection: GeoJSON.FeatureCollection;

        if (Array.isArray(input)) {
            if (!input.length) return null;

            featureCollection = {
                type: 'FeatureCollection',
                features: input
            };
        }
        else if (input.type === 'FeatureCollection') {
            if (!input.features?.length) return null;
            featureCollection = input;
        }
        else {
            featureCollection = {
                type: 'FeatureCollection',
                features: [input]
            };
        }

        const [minX, minY, maxX, maxY] = bbox(featureCollection);

        return [
            [minX, minY],
            [maxX, maxY]
        ];
    }

    public onHint = (feature: any) => {
        if (!feature || !feature.properties) {
            return null;
        }

        const props = feature.properties;

        if (!props.hintTitle) {
            return null;
        }

        this.cdr.detectChanges();

        return {
            title: props.hintTitle,
            color: props.hintColor,
            coords: props.geometry?.coordinates || null,
            roadId: props.roadId,
            roadPartId: props.roadPartId,
            roadLength: props.roadLength,
            startKm: props.start_km || props.startKm,
            roadValue: props.roadValue
        };
    };


    private _watchFoDarkThemeChanges(): void {
        this.layoutService.configUpdate$
            .pipe(
                tap(() => this.theme.set(this.layoutService.config().darkTheme ? 'dark' : 'light'))
            )
            .subscribe();
    }

    public fitBounds(bounds, duration = 800) {
        this.map.update({ location: { bounds, ...{ easing: 'ease-in-out', duration, } } });
    }

    public withAlpha = (hex: string, a: number) =>
        hex + Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0').toUpperCase();

    public onVisibleChangeSidebar(event: boolean) {
        this.isVisible = event;
    }

    public onChangeSettings(_: any): void {
        this.isVisible = !this.isVisible;
    }

    public onChangeSidebarBottom(event: boolean) {
        this.isVisibleSidebarBottom = event;
    }

    trackById = (_: number, f: any) => f.id;

    trackByMarkerId(index: number, marker: any): string {
        return marker.id;
    }
}
