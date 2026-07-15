import { Injectable } from '@angular/core';
import { DirectionStateService } from './direction-state.service';
import { BehaviorSubject, distinctUntilChanged, finalize, forkJoin, map, Subject, takeUntil, timer } from 'rxjs';
import { deepEquals } from '@primeuix/utils';
import { environment } from '../../../../../environments/environment';
import { utils } from '../constants/utils';
import { IYandexRouteData, YandexRouteService } from './ymaps-route.service';
import { IDirectionPoint } from '../interfaces/direction-state.interface';
import { GeocoderService } from './geocoder.service';


@Injectable({
    providedIn: 'root',
})
export class DirectionService {
    private loadingCounter = 0;
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public updateRoute: Subject<any> = new Subject<any>();
    public error$ = this.directionState.state$
        .pipe(
            map(state => state.error),
            distinctUntilChanged((prev, curr) => deepEquals(prev, curr))
        );
    public destroy$ = new Subject<boolean>();
    constructor(
        private directionState: DirectionStateService,
        private routeService: YandexRouteService,
        private geocoder: GeocoderService
    ) {
        this.buildRouteSteps();

        this.routeService.routeChanged$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(route => {

                this.setDirections(route);

            });

    }

    private incrementLoading(): void {
        this.loadingCounter++;
        if (this.loadingCounter > 0) {
            this.loadingSubject.next(true);
        }
    }

    private buildRouteSteps(): void {

        this.directionState.state$
            .pipe(
                takeUntil(this.destroy$),
                map(state => ({
                    directions: state.directions,
                    unit: state.unit,
                    error: state.error
                })),
                distinctUntilChanged((a, b) => deepEquals(a, b))
            )
            .subscribe(state => {

                const { directions, unit, error } = state;

                if (error) {

                    this.updateRoute.next({
                        error
                    });

                    return;

                }

                if (!directions) {

                    this.updateRoute.next({

                        routes: 0,

                        summary: null,

                        duration: null,

                        distance: null,

                        steps: []

                    });

                    return;

                }

                this.updateRoute.next({

                    routes: directions.routes.length,

                    summary: directions.summary,

                    duration: directions.summary.duration,

                    distance: directions.summary.distance,

                    steps: directions.segments,

                    format: unit
                        ? utils[unit]
                        : undefined

                });

            });

    }


    private decrementLoading(): void {
        this.loadingCounter = Math.max(0, this.loadingCounter - 1);
        if (this.loadingCounter === 0) {
            this.loadingSubject.next(false);
        }
    }

    private validateAndNormalizeCoords(coords: [number, number]): [number, number] | null {
        if (!utils.validCoords(coords)) {
            coords = [utils.wrap(coords[0]), utils.wrap(coords[1])];
        }
        if (isNaN(coords[0]) || isNaN(coords[1])) {
            this.directionState.updateState({ error: 'Coordinates are not valid' });
            return null;
        }
        return coords;
    }


    private _addWaypointPoint(
        index: number,
        waypoint: IDirectionPoint
    ): void {

        const state = this.directionState.getState();

        const waypoints = [...state.waypoints];

        waypoints.splice(
            index,
            0,
            this.normalizeWaypoint(waypoint)
        );

        this.directionState.updateState({
            waypoints
        });

        if (state.destination.value) {
            this.fetchDirections();
        }

    }
    private normalizeWaypoint(waypoint: any): any {
        const properties = { id: 'waypoint' };
        return Object.assign(waypoint, {
            properties: waypoint.properties ? Object.assign(waypoint.properties, properties) : properties,
        });
    }


    // public setRouteIndex(routeIndex) {
    //     this.directionState.updateState({
    //         routeIndex: routeIndex,
    //     });
    // }


    public redraw(): void {
        const currentState = this.directionState.getState();
        const clonedState = { ...currentState };
        this.directionState.updateState({
            ...clonedState,
            directions: [],
            error: null,
        });

        timer(0).subscribe(() => {
            this.directionState.updateState(clonedState);
        });
    }

    public setProfile(profile: string): void {
        this.directionState.updateState({ profile });
        this.fetchDirectionsIfReady();
    }

    public clearOrigin(): void {

        this.directionState.clearOrigin();
        this.routeService.clear();

    }

    public clearDestination(): void {

        this.directionState.clearDestination();
        this.routeService.clear();

    }

    private createDirectionPoint(
        point: string | [number, number] | IDirectionPoint,
        extraParams?: any
    ): IDirectionPoint {

        if (
            point &&
            typeof point === 'object' &&
            'value' in point
        ) {
            return {
                ...point,
                ...extraParams
            };
        }

        return {
            value: point,
            label: typeof point === 'string'
                ? point
                : '',
            coordinates: Array.isArray(point)
                ? point
                : undefined,
            ...extraParams
        };

    }


    public destroy(): void {
        //this.destroy$.next(true);
        // this.destroy$.complete();

        this.directionState.destroy();
        //this.loadingSubject.complete();
    }

    public hoverMarker(coordinates: [number, number] | null): void {
        const feature = coordinates ? utils.createPoint(coordinates, { id: 'hover' }) : {};
        this.directionState.updateState({ hoverMarker: feature });
    }

    // public addWaypoint(
    //     index: number,
    //     waypoint: string | [number, number] | IDirectionPoint,
    //     extraParams?: any
    // ): void {

    //     let point: IDirectionPoint;

    //     // Уже готовый объект
    //     if (waypoint && typeof waypoint === 'object' && 'value' in waypoint) {

    //         point = {
    //             ...waypoint,
    //             ...extraParams
    //         };

    //     } else {

    //         // Строка или координаты
    //         point = {
    //             value: waypoint,
    //             label: typeof waypoint === 'string'
    //                 ? waypoint
    //                 : '',
    //             coordinates: Array.isArray(waypoint)
    //                 ? waypoint
    //                 : undefined,
    //             ...extraParams
    //         };

    //     }

    //     this._addWaypointPoint(index, point);

    // }

    public addWaypoint(
        index: number,
        waypoint: string | [number, number] | IDirectionPoint,
        extraParams?: any
    ): void {

        const point = this.createDirectionPoint(
            waypoint,
            extraParams
        );

        this.geocoder
            .resolvePoint(point)
            .subscribe(point => {

                if (!point.coordinates) {
                    return;
                }

                this._addWaypointPoint(
                    index,
                    point
                );

            });

    }

    public addHoverWaypoint(
        index: number,
        waypoint: string | [number, number] | IDirectionPoint,
        extraParams?: any
    ): void {

        const state = this.directionState.getState();

        const point = this.createDirectionPoint(
            waypoint,
            extraParams
        );

        this.geocoder
            .resolvePoint(point)
            .subscribe(point => {

                if (!point.coordinates) {
                    return;
                }

                const hoverWaypoints = [
                    ...state.hoverWaypoints,
                    point
                ];

                this.directionState.updateState({
                    hoverWaypoints
                });

                if (state.destination.value) {

                    this.fetchDirections();
                }

            });

    }


    public updateHoverWaypoint(
        index: number,
        coords: [number, number],
        extraParams?: any
    ): void {

        const state = this.directionState.getState();

        const hoverWaypoints = [...state.hoverWaypoints];

        if (!hoverWaypoints[index]) {
            return;
        }

        hoverWaypoints[index] = {

            ...hoverWaypoints[index],

            value: coords,

            coordinates: coords,

            ...extraParams

        };

        this.directionState.updateState({

            hoverWaypoints

        });

        if (state.destination.value) {

            this.fetchDirections();

        }

    }

    public setWaypoint(
        index: number,
        waypoint: string | [number, number] | IDirectionPoint,
        extraParams?: any
    ): void {

        const state = this.directionState.getState();

        const waypoints = [...state.waypoints];

        const point = this.createDirectionPoint(
            waypoint,
            extraParams
        );

        this.geocoder
            .resolvePoint(point)
            .subscribe(point => {

                waypoints[index] = point;

                this.directionState.updateState({
                    waypoints
                });

                if (state.destination.value) {
                    this.fetchDirections();
                }

            });

    }

    public setWaypoints(
        waypoints: (string | [number, number] | IDirectionPoint)[],
        extraParams?: any | any[]
    ): void {

        const state = this.directionState.getState();

        const requests = waypoints.map((point, index) => {

            const params = Array.isArray(extraParams)
                ? extraParams[index]
                : extraParams;

            return this.geocoder.resolvePoint(
                this.createDirectionPoint(point, params)
            );

        });

        forkJoin(requests).subscribe(updatedWaypoints => {

            this.directionState.updateState({
                waypoints: updatedWaypoints
            });

            if (state.destination.value) {
                this.fetchDirections();
            }

        });

    }

    public updateWaypoint(
        index: number,
        coords: [number, number],
        extraParams?: any
    ): void {

        const state = this.directionState.getState();

        const waypoints = [...state.waypoints];

        if (!waypoints[index]) {
            return;
        }

        waypoints[index] = {

            ...waypoints[index],

            value: coords,

            coordinates: coords,

            ...extraParams

        };

        this.directionState.updateState({
            waypoints
        });

        if (state.destination.value) {
            this.fetchDirections();
        }

    }

    public removeWaypoint(index: number): void {

        const state = this.directionState.getState();

        if (!state.waypoints.length) {
            return;
        }

        if (index < 0 || index >= state.waypoints.length) {
            return;
        }

        const waypoints = [...state.waypoints];

        waypoints.splice(index, 1);

        this.directionState.updateState({
            waypoints
        });

        if (state.destination.value) {
            this.fetchDirections();
        }

    }

    public removeWaypoints(indices: number[]): void {

        const state = this.directionState.getState();

        if (!state.waypoints.length) {
            return;
        }

        const waypoints = state.waypoints.filter(
            (_, index) => !indices.includes(index)
        );

        this.directionState.updateState({
            waypoints
        });

        if (state.destination.value) {
            this.fetchDirections();
        }

    }

    public clearWaypoints(): void {

        const state = this.directionState.getState();

        if (!state.waypoints.length) {
            return;
        }

        this.directionState.updateState({
            waypoints: []
        });

        this.refreshRoute();

    }


    public reverse(): void {

        const state = this.directionState.getState();

        const origin = state.origin;
        const destination = state.destination;

        if (!origin.value && !destination.value) {
            return;
        }

        this.directionState.setOrigin({
            ...destination
        });

        this.directionState.setDestination({
            ...origin
        });

        this.refreshRoute();

    }


    private refreshRoute(): void {

        const state = this.directionState.getState();

        if (
            state.origin.value &&
            state.destination.value
        ) {
            this.fetchDirections();
        }

    }

    public getDirections(): IYandexRouteData | null {

        return this.directionState
            .getState()
            .directions;

    }

    public setDirections(
        directions: IYandexRouteData
    ): void {

        this.directionState.updateState({

            directions

        });

    }

    public setOrigin(
        point: IDirectionPoint
    ): void {

        this.geocoder
            .resolvePoint(point)
            .subscribe(point => {

                if (!point.coordinates) {
                    return;
                }

                this.directionState.setOrigin(point);

                this.refreshRoute();

            });

    }
    // public setOriginFromCoordinates(coords: [number, number]): void {
    //     const normalized = this.validateAndNormalizeCoords(coords);
    //     if (!normalized) return;
    //     this.queryOriginCoordinates(normalized);
    //     this.createOrigin(normalized);
    // }


    // public queryOriginCoordinates(coords: [number, number]): void {
    //     this.directionState.updateState({
    //         origin: { geometry: { coordinates: coords } },
    //     });
    // }

    // public createOrigin(coords: [number, number], data?: any): void {
    //     const state = this.directionState.getState();
    //     const destination = state.destination;
    //     this.originPoint(coords, data);
    //     if (destination?.geometry) {
    //         this.fetchDirections();
    //     }
    // }

    public originPoint(coords: [number, number], data?: any): void {
        const origin = utils.createPoint(coords, { ...data, id: 'origin', 'markerSymbol': 'A' });
        this.directionState.updateState({ origin });
    }


    public setDestination(
        point: IDirectionPoint
    ): void {

        this.geocoder
            .resolvePoint(point)
            .subscribe(point => {

                if (!point.coordinates) {
                    return;
                }

                this.directionState.setDestination(point);

                this.refreshRoute();

            });

    }

    // public setDestinationFromCoordinates(coords: [number, number]): void {
    //     const normalized = this.validateAndNormalizeCoords(coords);
    //     if (!normalized) return;
    //     this.queryDestinationCoordinates(normalized);
    //     this.createDestination(normalized);
    // }

    // public queryDestinationCoordinates(coords: [number, number]): void {
    //     this.directionState.updateState({
    //         destination: { geometry: { coordinates: coords } },
    //     });
    // }

    // public createDestination(coords: [number, number], data?: any): void {
    //     const state = this.directionState.getState();
    //     const origin = state.origin;
    //     this.destinationPoint(coords, data);
    //     if (origin?.geometry) {
    //         this.fetchDirections();
    //     }
    // }

    public destinationPoint(coords: [number, number], data?: any): void {
        const destination = utils.createPoint(coords, { ...data, id: 'destination', 'markerSymbol': 'B', });
        this.directionState.updateState({ destination });
    }

    public queryOrigin(query: string): void {
        this.directionState.updateState({ originQuery: query });
    }

    public queryDestination(query: string): void {
        this.directionState.updateState({ destinationQuery: query });
    }

    private fetchDirectionsIfReady(): void {

        const state = this.directionState.getState();

        if (
            state.origin.value &&
            state.destination.value
        ) {
            this.fetchDirections();
        }

    }


    public fetchDirections(): void {

        const state = this.directionState.getState();

        if (
            !state.origin.value ||
            !state.destination.value
        ) {
            return;
        }

        this.incrementLoading();

        this.routeService.update(

            state.origin,

            state.destination,

            state.waypoints,

            state.profile as any

        )
            .pipe(
                finalize(() => this.decrementLoading())
            )
            .subscribe({

                next: route => {

                    this.directionState.updateState({

                        directions: route,

                        error: null

                    });

                },

                error: error => {

                    this.directionState.updateState({

                        error

                    });

                }

            });

    }

    private buildDirectionsQuery(state: any): string {
        const { origin, destination, waypoints, hoverWaypoints } = state;

        const getCoords = (item: any): string | null => {
            return item && item.geometry && Array.isArray(item.geometry.coordinates)
                ? item.geometry.coordinates.join(',')
                : null;
        };

        const parts: string[] = [];

        const originCoords = getCoords(origin);
        if (originCoords) {
            parts.push(originCoords + ';');
        }

        if (Array.isArray(waypoints)) {
            waypoints.forEach(wp => {
                const wpCoords = getCoords(wp);
                if (wpCoords) {
                    parts.push(wpCoords + ';');
                }
            });
        }

        if (Array.isArray(hoverWaypoints)) {
            hoverWaypoints.forEach(hw => {
                const hwCoords = getCoords(hw);
                if (hwCoords) {
                    parts.push(hwCoords + ';');
                }
            });
        }

        const destCoords = getCoords(destination);
        if (destCoords) {
            parts.push(destCoords);
        }

        return encodeURIComponent(parts.join(''));
    }

    private buildRequestOptions(state): string[] {
        const options = ['geometries=polyline', 'steps=true', 'overview=full'];
        if (state.alternatives) options.push('alternatives=true');
        if (state.language) options.push(`language=${state.language}`);
        options.push(`access_token=${environment.accessTokenMapBox}`);
        return options;
    }
}
