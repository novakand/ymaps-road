import { Injectable } from '@angular/core';
import { from, Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { YandexApiLoaderService } from './ymaps-api.service';
import { LineString, Feature } from 'geojson';
import { IDirectionPoint } from '../interfaces/direction-state.interface';

@Injectable({
    providedIn: 'root'
})
export class YandexRouteService {

    private route: any = null;
    private readonly routeChangedSubject =
        new Subject<IYandexRouteData>();

    public readonly routeChanged$ =
        this.routeChangedSubject.asObservable();

    constructor(
        private loader: YandexApiLoaderService
    ) { }



    private buildRoutes(): IYandexRoute[] {

        const routes = this.route.getRoutes();

        const result: IYandexRoute[] = [];

        routes.each((route: any, index: number) => {

            const geoJson =
                this.normalizeRouteGeoJson(
                    route.model.getJson()
                );

            result.push({

                index,

                active:
                    route === this.route.getActiveRoute(),

                distance:
                    route.properties.get('distance'),

                duration:
                    route.properties.get('duration'),

                durationInTraffic:
                    route.properties.get('durationInTraffic'),

                blocked:
                    route.properties.get('blocked'),

                type:
                    route.properties.get('type'),

                geoJson,


            });

        });

        return result;

    }

    private normalizeRouteGeoJson(
        geoJson: any
    ): GeoJSON.FeatureCollection {

        return {
            type: 'FeatureCollection',
            features: geoJson.features.flatMap((group: any) =>
                (group.features ?? []).map((feature: any) => ({
                    ...feature,
                    geometry: {
                        ...feature.geometry,
                        coordinates: feature.geometry.coordinates
                    }
                }))
            )
        };

    }

    private buildRouteData(): IYandexRouteData | null {
        if (!this.route) {
            return null;
        }

        const activeRoute = this.route.getActiveRoute();

        if (!activeRoute) {
            console.error('ACTIVE ROUTE IS NULL');
            return null;

        }

        const geoJson = activeRoute.model.getJson();
        if (!geoJson) {
            console.error('GEOJSON IS NULL');
            return null;

        }

        const steps: GeoJSON.Feature[] = [];

        const paths = activeRoute.getPaths();
        const wayPoints = this.route.model.getWayPoints();

        paths.each((path: any, pathIndex: number) => {

            const point = wayPoints[pathIndex];
            const isFirst = pathIndex === 0;

            steps.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: point.geometry.getCoordinates()
                },
                properties: {
                    ...point.properties.getAll(),
                    text: point.properties.get('description'),
                    action: {
                        value: isFirst ? 'depart' : 'waypoint',
                        text: isFirst ? 'depart' : 'waypoint'
                    }
                }
            });

            path.getSegments().each((segment: any) => {

                steps.push({
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: segment.geometry.getCoordinates()
                    },
                    properties: segment.properties.getAll()
                });

            });

        });

        const lastPoint = wayPoints.at(-1);

        steps.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: lastPoint.geometry.getCoordinates()
            },
            properties: {
                ...lastPoint.properties.getAll(),
                text: lastPoint.properties.get('description'),
                action: {
                    value: 'arrive',
                    text: 'arrive'
                }
            }
        });

        const normalizedGeoJson =
            this.normalizeRouteGeoJson(
                geoJson
            );


        if (!normalizedGeoJson.features.length) {
            return null;
        }

        return {

            routeModel: activeRoute,

            routes:
                this.buildRoutes(),

            summary: {

                distance:
                    activeRoute.properties.get('distance'),

                duration:
                    activeRoute.properties.get('duration'),

                durationInTraffic:
                    activeRoute.properties.get('durationInTraffic'),

                hasTolls:
                    activeRoute.properties.get('hasTolls'),

                blocked:
                    activeRoute.properties.get('blocked'),

                type:
                    activeRoute.properties.get('type')

            },

            referencePoints:
                this.route.model.getReferencePoints(),

            wayPoints:
                this.route.getWayPoints(),

            viaPoints:
                this.route.getViaPoints(),

            geoJson,

            routeGeoJson:
                normalizedGeoJson,

            steps: steps,
            segments: normalizedGeoJson.features

        };

    }


    public clear(): void {

        if (!this.route) {
            return;
        }
        this.destroy();
        //this.route.model.setReferencePoints([]);

        this.routeChangedSubject.next(null as any);
    }

    public getData(): IYandexRouteData | null {

        if (!this.route) {
            return null;
        }

        return this.buildRouteData();

    }

    public create(
        origin: IDirectionPoint,
        destination: IDirectionPoint,
        waypoints: IDirectionPoint[] = [],
        mode: 'driving' | 'pedestrian' | 'masstransit' = 'driving'
    ): Observable<any> {


        if (this.route) {

            return of(this.route);

        }

        return from(this.loader.load()).pipe(

            switchMap((ymaps: any) =>

                new Observable(observer => {

                    this.route = new ymaps.multiRouter.MultiRoute({

                        referencePoints: [

                            origin.value,

                            ...waypoints.map(w => w.value),

                            destination.value

                        ],

                        params: {

                            routingMode: 'auto',
                            avoidTrafficJams: true,
                            reverseGeocoding: true,

                        }

                    }, {

                        boundsAutoApply: false

                    });

                    this.bindEvents();

                    const onSuccess = () => {

                        this.route.model.events.remove(
                            'requestsuccess',
                            onSuccess
                        );

                        this.route.model.events.remove(
                            'requestfail',
                            onFail
                        );

                        observer.next(
                            this.buildRouteData()
                        );

                        observer.complete();

                    };

                    const onFail = (e: any) => {

                        this.route.model.events.remove(
                            'requestsuccess',
                            onSuccess
                        );

                        this.route.model.events.remove(
                            'requestfail',
                            onFail
                        );

                        observer.error(
                            e.get?.('error') ?? e
                        );

                    };

                    this.route.model.events.add(
                        'requestsuccess',
                        onSuccess
                    );

                    this.route.model.events.add(
                        'requestfail',
                        onFail
                    );

                })

            )

        );

    }

    public setActiveRoute(index: number): void {

        if (!this.route) {
            return;
        }

        const routes = this.route.getRoutes();

        if (!routes) {
            return;
        }

        const route = routes.get(index);

        if (!route) {
            return;
        }

        this.route.setActiveRoute(route);

    }


    public getActiveRouteIndex(): number {

        const routes = this.route?.getRoutes();

        if (!routes) {
            return 0;
        }

        let activeIndex = 0;

        routes.each((route: any, index: number) => {

            if (route === this.route.getActiveRoute()) {
                activeIndex = index;
            }

        });

        return activeIndex;

    }

    public getInstance(): any {

        return this.route;

    }

    public getActiveRoute(): any {

        if (!this.route) {
            return null;
        }

        return this.route.getActiveRoute?.();

    }

    public getRoutes(): any {

        if (!this.route) {
            return null;
        }

        return this.route.getRoutes?.();

    }

    public getWayPoints(): any {

        if (!this.route) {
            return null;
        }

        return this.route.getWayPoints?.();

    }

    public getViaPoints(): any {

        if (!this.route) {
            return null;
        }

        return this.route.getViaPoints?.();

    }

    // public destroy(): void {

    //     if (!this.route) {
    //         return;
    //     }

    //       this.route = null;

    // }


    public destroy(): void {

        if (!this.route) {
            return;
        }

        // this.route.model.events.removeAll();

        // this.route.events.removeAll();

        // this.route = null;

    }

    private bindEvents(): void {

        this.route.model.events.add(
            'requestsend',
            () => {
            }
        );

        this.route.model.events.add(
            'requestsuccess',
            () => {


            }
        );

        this.route.model.events.add(
            'requestfail',
            (e: any) => {

                console.error(
                    'requestfail',
                    e.get?.('error') ?? e
                );

            }
        );


        this.route.events.add(
            'activeroutechange',
            () => {


                const data = this.buildRouteData();

                if (!data) {
                    return;
                }

                this.routeChangedSubject.next(data);

            }
        );

    }


    public update(
        origin: IDirectionPoint,
        destination: IDirectionPoint,
        waypoints: IDirectionPoint[] = [],
        mode: 'driving' | 'pedestrian' | 'masstransit' = 'driving'
    ): Observable<any> {

        if (!this.route) {

            return this.create(
                origin,
                destination,
                waypoints,
                mode
            );

        }

        return new Observable(observer => {

            const onSuccess = () => {

                this.route.model.events.remove(
                    'requestsuccess',
                    onSuccess
                );

                this.route.model.events.remove(
                    'requestfail',
                    onFail
                );

                observer.next(
                    this.buildRouteData()
                );

                observer.complete();

            };

            const onFail = (e: any) => {

                this.route.model.events.remove(
                    'requestsuccess',
                    onSuccess
                );

                this.route.model.events.remove(
                    'requestfail',
                    onFail
                );

                observer.error(
                    e.get?.('error') ?? e
                );

            };

            this.route.model.events.add(
                'requestsuccess',
                onSuccess
            );

            this.route.model.events.add(
                'requestfail',
                onFail
            );

            this.route.model.setReferencePoints([

                origin.value,

                ...waypoints.map(w => w.value),

                destination.value

            ]);

        });

    }

}


export interface IYandexRouteData {

    summary: {

        distance: any;

        duration: any;

        durationInTraffic: any;

        hasTolls: boolean;

        blocked: boolean;

        type: string;

    };
    routeModel: any;

    routes: IYandexRoute[];

    geoJson: GeoJSON.FeatureCollection;

    routeGeoJson: GeoJSON.FeatureCollection;

    steps: GeoJSON.Feature[];

    referencePoints: any[];

    wayPoints: any;

    viaPoints: any;

    segments: any;



}


export interface IYandexRoute {

    index: number;

    active: boolean;

    distance: any;

    duration: any;

    durationInTraffic: any;

    blocked: boolean;

    type: string;

    geoJson: GeoJSON.FeatureCollection;



}