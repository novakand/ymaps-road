import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { Subject, filter, takeUntil } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MapComponent } from '../../../app/components/maps/map.component';
import { LayoutService } from '../../../app/services/layout.service';
import { LoadProgressService } from '../../../app/services/load-progress.service';
import { MapDirectionComponent } from '../../../app/components/maps/components/map-directions/map-directions.component';

@Component({
    selector: 'map-layout',
    imports: [CommonModule,
        MapComponent,
        RouterModule,
        RouterOutlet,
        ProgressBarModule,
        RouterOutlet,
        MapDirectionComponent],
    providers: [],
    templateUrl: './map-layout.component.html',
    styleUrl: './map-layout.component.scss',
})
export class MapLayoutComponent implements AfterViewInit, OnInit, OnDestroy {

    public showProgress: boolean = false;
    public sidenavViewContent: string;
    public isSidebarButton = true;
    public toolbarActions: any[];
    public excludedToolbarIds = ['filter', 'export', 'settings'];
    public isSmallScreen: boolean;

    public destroy$ = new Subject<boolean>();

    constructor(
        private _router: Router,
        public layoutService: LayoutService,
        private _loadProgressService: LoadProgressService,
        private breakpointObserver: BreakpointObserver,

    ) {


        this.breakpointObserver
            .observe(['(max-width: 767px)'])
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(state => {

                this.isSmallScreen =
                    state.breakpoints[
                    '(max-width: 767px)'
                    ];

                if (this.isSmallScreen) {

                    // this.layoutService
                    //     .setMapLayoutMode(
                    //         'stack'
                    //     );

                    this.layoutService
                        .isMapSidebar
                        .set(true);

                } else {

                    this.layoutService
                        .setMapLayoutMode(
                            'overlay'
                        );

                    this.layoutService
                        .isMapSidebar
                        .set(true);

                }

            });

        this._watchForRouteChanges();
        this._watchForLoadProgress();
    }

    private _watchForRouteChanges(): void {
        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd)
        ).subscribe((event) => {
            window.scrollTo(0, 0);
        });
    }

    private _watchForLoadProgress(): void {
        this._loadProgressService.inProgress
            .subscribe((progress: boolean) => {
                this.showProgress = progress;
            });
    }

    public ngOnInit(): void {

    }

    public ngAfterViewInit(): void { }

    public onActivateRouterOutlet(): void {

    }
    public toggleSideBar(): void {
        this.layoutService.toggleSideBar();
    }

    public mapLayoutMode =
        computed(
            () =>
                this.layoutService.mapLayoutMode()
        );

    public isMapSidebar = computed(() => this.layoutService.isMapSidebar());


    public onShowMap() {
        this.layoutService.toggleSideBar();
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}
