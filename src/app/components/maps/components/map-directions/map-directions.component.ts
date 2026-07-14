import { CommonModule, NgFor, NgIf } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, OnDestroy, OnInit, QueryList, signal, ViewChild, ViewChildren } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BehaviorSubject, debounceTime, delay, distinctUntilChanged, filter, map, Observable, of, pairwise, skip, startWith, Subject, Subscription, takeUntil, tap } from "rxjs";
import { Timeline } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { DatePipe } from '@angular/common'
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from "@angular/forms";
import { SpeedDialModule } from 'primeng/speeddial';
import { ProgressBarModule } from 'primeng/progressbar';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MenuItem } from "primeng/api";
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { AutoComplete, AutoCompleteModule } from "primeng/autocomplete";
import { StepsModule } from 'primeng/steps';
import { SkeletonModule } from "primeng/skeleton";
import { ButtonModule } from "primeng/button";
import { StepperModule } from 'primeng/stepper';
import { AccordionModule } from 'primeng/accordion';
import { ListboxModule } from 'primeng/listbox';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from "primeng/tooltip";
import { deepEquals, isNotEmpty } from "@primeuix/utils";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { StyleClassModule } from 'primeng/styleclass';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { PointType } from "./constants/point-type.constant";
import { PointTypePlace } from "./constants/point-type-place.constants";
import { PointTypeField } from "./constants/point-type-field.constant";
import { DirectionService } from "./services/directions.service";
import { DirectionsIconPipe } from "./pipes/directions-icon.pipe";
import { DistancePipe } from "./pipes/distance.pipe";
import { IsTextOverflowingPipe } from "./pipes/text-overflowing.pipe";
import { MapSearchService } from "../../services/map-search.service";
import { YandexRouteService } from "./services/ymaps-route.service";
import { IDirectionPoint } from "./interfaces/direction-state.interface";
import { DirectionStateService } from "./services/direction-state.service";
import { MapService } from "../../services/map-service";
import { LoadProgressService } from "../../../../services/load-progress.service";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { LayerStateService } from "../../services/layer-state.service";
import { RoadSelectionStateService } from "../../services/road-selection.service";
import { LayoutService } from "../../../../services/layout.service";

@Component({
    selector: 'app-map-directions',
    templateUrl: './map-directions.component.html',
    styleUrls: ['./map-directions.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        Timeline,
        DialogModule,
        ChipModule,
        ReactiveFormsModule,
        SpeedDialModule,
        ProgressBarModule,
        DragDropModule,
        StepperModule,
        ContextMenuModule,
        InputGroupModule,
        InputGroupAddonModule,
        AutoCompleteModule,
        StepsModule,
        SkeletonModule,
        ButtonModule,
        AccordionModule,
        ListboxModule,
        DrawerModule,
        FormsModule,
        TooltipModule,
        StyleClassModule,
        IconFieldModule,
        InputIconModule,
        DirectionsIconPipe,
        DistancePipe,
        RippleModule,
        IsTextOverflowingPipe,
        ToggleSwitchModule

    ],
    providers: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapDirectionComponent implements AfterViewInit, OnInit, OnDestroy {

    @ViewChildren('waypoints') waypointsFields!: QueryList<AutoComplete>;

    public routeActive: any = 0;
    public isVisibleRouteSteps = false;
    public maxWaypoints = 8;
    public dataSourceStep: any;
    public dataSour;
    public mapOptions: any;
    private _map: any;
    public pointType = PointType;
    public searchData$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public isVisibleSettings: boolean = false;
    public isVisibleRoadSelection: boolean = false;
    public inProgress = false;
    public noProgress: boolean = true;
    public position: any = 'bottom';
    public dragDisabled = false;
    public routes: any[] = [];
    public form: FormGroup;
    public selectedPoint: GeoJSON.Feature<GeoJSON.Point> | any;
    public _destroy$ = new Subject<boolean>();
    public pointTypePlace = PointTypePlace;
    public pointTypeField = PointTypeField;
    private _isMapSidebar = signal(true);


    public layers = {
        intersections: true,
        active: true,
        axle: false,
        alternative: true,
        axleBbox: false
    };
    public isLargeScreen: boolean;
    private timelineDataSubject = new BehaviorSubject<any[]>([]);
    public timelineData$: Observable<any> = this.timelineDataSubject.asObservable();
    private dropSubject: Subject<CdkDragDrop<any[]>> = new Subject<CdkDragDrop<any[]>>();
    private dropSubscription: Subscription;
    public selectedRoad: any = null;
    public selectedAxleLoads: any[] = [];
    constructor(
        private _cdr: ChangeDetectorRef,
        private _fb: FormBuilder,
        private _mapService: MapService,
        public directionService: DirectionService,
        public mapSearchService: MapSearchService,
        private breakpointObserver: BreakpointObserver,
        private routeService: YandexRouteService,
        private directionState: DirectionStateService,
        private _loadProgressService: LoadProgressService,
        public layerStateService: LayerStateService,
        private roadSelectionState: RoadSelectionStateService,
        public layoutService: LayoutService,
    ) {

        this.buildForm();
        this.inProgress = false;
        this._watchForMapLoadChanges();
        this._watchDirections();

        this.updateTimelineData();

        this.breakpointObserver
            .observe(['(max-width: 992px)'])
            .subscribe((state: BreakpointState) => {
                this.isLargeScreen = state.matches;
            });

        this.dropSubscription = this.dropSubject
            .pipe(
                takeUntil(this._destroy$),
            ).subscribe((event: CdkDragDrop<any[]>) => {
                this.handleDrop(event);
            });


        this.roadSelectionState.state$
            .pipe(
                skip(1),
                takeUntil(this._destroy$)
            )
            .subscribe(state => {
                this.selectedRoad = state.road;
                this.isVisibleRoadSelection = true;
                this._cdr.detectChanges();

            });
    }

    public onRoadSelectionHide(): void {

        this.selectedRoad = null;
        this._cdr.markForCheck();
        this.roadSelectionState.clear();
    }


    public onOnlineChange(enabled: boolean): void {

        this.layerStateService.update({
            axle: enabled
        });

    }


    public getDirections() {
        return this.directionState.getState().directions;
    }

    public onSettings(): void {
        this.isVisibleSettings = !this.isVisibleSettings;
        this._cdr.markForCheck();


    }

    public onRoadSelection(): void {
        this.isVisibleRoadSelection = !this.isVisibleRoadSelection;
        this._cdr.markForCheck();

    }


    public getStepCoordinates(step: any): [number, number] | null {

        if (!step?.geometry) {
            return null;
        }

        const coordinates = step.geometry.coordinates;

        if (typeof coordinates[0] === 'number') {
            return coordinates;
        }

        return coordinates[0] ?? null;
    }

    private _watchDirections(): void {

        this.directionState.state$
            .pipe(
                filter(Boolean),
                map(state => state.directions?.routes ?? []),

                // distinctUntilChanged((a, b) =>
                //     JSON.stringify(a) === JSON.stringify(b)
                // ),

                takeUntil(this._destroy$)
            )
            .subscribe(routes => {

                this.routes = routes;
                this._cdr.markForCheck();
                const active = this.routes.find(r => r.active);
                this._cdr.markForCheck();
                if (active) {

                    this.routeActive = active.index;
                    this._cdr.detectChanges();

                    this.onRouteChange(active.index);

                }

                this._cdr.markForCheck();

            });

    }

    private handleDrop(event: CdkDragDrop<any[]>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }

        const route: any[] = [];

        const fromGroupValue = this.form.get('from')?.value;
        route.push({ segment: 'from', data: fromGroupValue });

        const waypoints = this.form.get('waypoints') as FormArray;
        waypoints.controls.forEach((group: AbstractControl) => {
            const groupValue = group.value;
            route.push({ segment: 'intermediate', data: groupValue });
        });

        const toGroupValue = this.form.get('to')?.value;
        route.push({ segment: 'to', data: toGroupValue });

        moveItemInArray(route, event.previousIndex, event.currentIndex);

        const convertToPlain = (data: any): any => {
            return (data && data.hasOwnProperty('value')) ? data.value : data;
        };

        const firstSegment = route[0];
        const newFromPlain = convertToPlain(firstSegment.data);
        const newFrom = newFromPlain ? { ...newFromPlain, type: 'loading' } : null;

        const lastSegment = route[route.length - 1];
        const newToPlain = convertToPlain(lastSegment.data);
        const newTo = newToPlain ? { ...newToPlain, type: 'unloading' } : null;

        const newIntermediateRaw = route.slice(1, route.length - 1);
        const newIntermediate = newIntermediateRaw.map(item => {
            if (item.data && item.data.hasOwnProperty('value')) {
                return item.data;
            } else {
                return { value: item.data };
            }
        });

        this.form.patchValue({
            from: { value: newFrom, loading: false },
            to: { value: newTo, loading: false }
        });

        newIntermediate.forEach((data, index) => {
            if (waypoints.at(index)) {
                (waypoints.at(index) as FormGroup).patchValue(data);
            }
        });

        this.updateTimelineData();
        this.setDirectionOrigin();
        this.setDirectionDestination();
        this.setDirectionWaypoints();
    }


    public toggleSideBar(): void {
        this.layoutService.toggleSideBar();

    }

    public isMapSidebar = computed(() => this._isMapSidebar());

    public containerClass = computed(() => {
        return {
            'sidebar-active': this.isMapSidebar(),
        };
    });

    public onStepMouseover(step: any): void {
        this.directionState.setHoveredStep(step);
    }

    public onStepMouseout(): void {
        this.directionState.clearHoveredStep();
    }

    public onStepClick(step: any): void {
        this.directionState.setHoveredStep(null);
        this.directionState.setFocusedStep(step);
    }

    public ngAfterViewInit(): void {
        this.waypointsFields.changes
            .pipe(
                filter((waypoints) => waypoints.length > 0),
                takeUntil(this._destroy$),

            ).subscribe();
    }

    public onRouteListboxChanges(event: any): void {
        this.routeActive = event.value;
        this.onRouteChange(
            this.routeActive
        );
        this._cdr.markForCheck();

    }


    public onRouteClick(event: any): void {
        this.isVisibleRouteSteps = !this.isVisibleRouteSteps;
        this._cdr.markForCheck();
    }

    public onUpdateRoute(data): void {
        const { routeIndex } = data;

        if (routeIndex === undefined || routeIndex === null) {
            return;
        }

        this.dataSourceStep = data;
        this.routeActive = routeIndex.toString();

        const routesCount = data?.routes || 0;
        this.dataSour = Array.from({ length: routesCount }, (_, index) => ({
            ...data,
            name: `${index + 1}`,
            value: index.toString(),
        }));
        this._cdr.markForCheck();
    }

    public onRouteChange(index: number): void {

        this.routeService.setActiveRoute(index);

        const data = this.routeService.getData();

        if (!data) { return; }

        const route = data.routes.find(r => r.index === index);

        if (!route) { return; }

        this.dataSourceStep = {
            summary: '',
            duration: data.summary.duration?.text,
            distance: data.summary.distance?.text,
            steps: data.steps
        };
        this._cdr.detectChanges();
    }


    public ngOnInit(): void {
        this._watchForDirectionsLoadChanges();
    }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    private _watchForMapLoadChanges(): void {
        this._mapService.load$
            .pipe(
                filter(Boolean),
                delay(100),
                takeUntil(this._destroy$),
            ).subscribe((data) => {
                this.noProgress = false;
                this._cdr.detectChanges();
            })
    }

    public onUnSelectWaypoint(fieldIndex: number): void {
        this.directionService.removeWaypoint(fieldIndex);
    }

    public onSelectWaypoint(fieldIndex: number, type: any): void {
        const arrayControl = this.form.get('waypoints') as FormArray;
        const currentValue = arrayControl.at(fieldIndex).value;
        this.directionService.removeWaypoint(fieldIndex);
        this.directionService.addWaypoint(fieldIndex, currentValue.value.label, { fieldIndex, geocoding: true, type });
        this._cdr.detectChanges();
    }

    public onKeyUpOriginDestination(formControlName: string): void { }

    public onKeyUpWaypoint(fieldIndex) {
        const arrayControl = this.form.get('waypoints') as FormArray;
        const currentValue = arrayControl.at(fieldIndex).value;
        this.directionService.removeWaypoint(fieldIndex);
    }

    public onUnselect(formControlName: string) {
        if (formControlName === 'to') {
            this.directionService.clearDestination();
        }
        if (formControlName === 'from') {
            this.directionService.clearOrigin();
        }
    }

    public onSelectOriginDestination(formControlName: string): void {
        if (formControlName === 'from') {
            this.setDirectionOrigin();
        }

        if (formControlName === 'to') {
            this.setDirectionDestination();
        }
    }


    private _watchForDirectionsLoadChanges(): void {
        this.directionService.loading$
            .pipe(
                takeUntil(this._destroy$),
                delay(100),
                distinctUntilChanged()
            )
            .subscribe((data) => {
                this.inProgress = data;
                this._loadProgressService.hide(9999)
                this._cdr.detectChanges();
            })
    }



    public onAddWaypoint(type, isLoading?): void {
        if (this.form.get('waypoints')?.value.length > this.maxWaypoints) return;
        this._addField(type, isLoading);
        this.updateTimelineData();
    }

    public onReset(): void {
        (this.form.get('waypoints') as FormArray).clear();
        this.updateTimelineData();
        this.directionService.clearWaypoints();
        this._cdr.detectChanges();
    }

    public onLayerMouseMove(event: any): void {
        this.selectedPoint = null;
        this.selectedPoint = (<any>event).features[0];
        this._cdr.detectChanges();
    }

    public onLayerMouseOut(event: any): void {
        this.selectedPoint = null;
        this._cdr.detectChanges();
    }


    public onSearch({ query }): void {
        this.mapSearchService.suggest(query)
            .pipe(
                debounceTime(100)
            )
            .subscribe((data: any) => {
                this.searchData$.next(data);
                this._cdr.detectChanges();
            });
    }


    public onDirectionsReverse(): void {
        this.directionService.reverse();

        const fromControl = this.form.get('from');
        const toControl = this.form.get('to');
        if (fromControl && toControl) {
            const fromValue = fromControl.get('value')?.value;
            const toValue = toControl.get('value')?.value;
            fromControl.patchValue({ value: toValue });
            toControl.patchValue({ value: fromValue });
        }
    }

    public onDrop(event: CdkDragDrop<any[]>): void {
        this.dropSubject.next(event);
    }

    public setDirectionOrigin(): void {

        const item = this.form
            .get('from')
            ?.get('value')
            ?.value;

        if (!item) {
            console.warn('Форма "from" не содержит данных.');
            return;
        }

        this.directionService.setOrigin({
            ...item,
            value: item.label
        });

    }

    public setDirectionDestination(): void {

        const item = this.form
            .get('to')
            ?.get('value')
            ?.value;

        if (!item) {
            console.warn('Форма "to" не содержит данных.');
            return;
        }

        this.directionService.setDestination({
            ...item,
            value: item.label

        });
    }

    public setDirectionWaypoints(): void {

        const formArray = this.form.get('waypoints') as FormArray;

        const waypoints: IDirectionPoint[] = [];

        formArray.controls.forEach(control => {

            const item = control.get('value')?.value;

            if (!item) {
                return;
            }

            waypoints.push({

                value: item.label,

                label: item.label,

                data: item

            });

        });

        this.directionService.setWaypoints(
            waypoints
        );

    }
    public onRemoveWaypoints(fieldIndex) {
        const arrayControl = this.form.get('waypoints') as FormArray;
        this.directionService.removeWaypoint(fieldIndex);
        arrayControl.removeAt(fieldIndex);
        this.updateTimelineData();
    }

    public onRemove(gropName) {
        this.form.get(gropName)?.patchValue({ value: null });
        this.onUnselect(gropName);
    }

    public onRemoveOriginDestination(gropName) {
        this.form.get(gropName)?.patchValue({ value: null });
        this.onUnselect(gropName);
    }


    get waypoints(): FormArray {
        return this.form.get('waypoints') as FormArray;
    }

    public updateTimelineData(): void {
        const timeline: any[] = [];

        timeline.push({
            formControlName: 'from',
            placeholder: 'Откуда',
            type: 'loading',
            loading: this.form.get('from.loading')?.value
        });

        this.waypoints.controls.forEach((group: AbstractControl, index: number) => {
            const grp = group as FormGroup;
            timeline.push({
                formControl: index,
                index,
                formControlName: 'value',
                placeholder: grp.get('placeholder')?.value,
                type: 'waypoints',
                loading: grp.get('loading')?.value,
            });
        });

        timeline.push({
            formControlName: 'to',
            placeholder: 'Куда',
            type: 'unloading',
            loading: this.form.get('to.loading')?.value
        });

        this.timelineDataSubject.next(timeline);
    }

    private _addField(fieldType?: string, isLoading?: boolean): void {
        const placeholder = this.getPlaceholderForType(fieldType);
        const group = this._fb.group({
            value: [null],
            type: [fieldType],
            placeholder: [placeholder],
            loading: isLoading,
        });
        this.waypoints.push(group);
    }

    private getPlaceholderForType(fieldType?: string): string {
        return 'Укажите промежуточную точку';
    }

    private _buildField(form): void {
        form?.waypoints?.forEach((item: any) => this._addField(item.type))
    }


    public onRender(event: any): void {
        event?.target?.resize();
    }

    public onClose(): void {
    }

    public _buildForm(): any {
        const formValue = this.form.value;
        return {
            ...formValue,

        };
    }


    private buildForm(): void {
        this.form = this._fb.group({
            from: this._fb.group({
                value: [null],
                loading: [false]
            }),
            to: this._fb.group({
                value: [null],
                loading: [false]
            }),
            route: new FormControl(null),
            waypoints: this._fb.array([]),
        });
    }


    public objectFieldOptionalValidator(requiredField: string, optionalField?): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) {
                return null;
            }

            if (typeof value === 'object') {
                if (!value[optionalField]) {
                    control.setValue(null);
                    return null;
                }

                if (value[requiredField]) {
                    return null;
                }
            }

            return { invalidObject: true };
        };
    }
}