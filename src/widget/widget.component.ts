import { Component, ViewEncapsulation } from '@angular/core';
import { MapLayoutComponent } from './components/map-layout/map-layout.component';
import { LayoutService } from '../app/services/layout.service';
import { CommonModule } from '@angular/common';
//npm run build-widget-release
@Component({
    selector: 'ymaps-widget-root',
    standalone: true,
    imports: [MapLayoutComponent, CommonModule],
    encapsulation: ViewEncapsulation.None,
    template: `<div class="layout-container" [ngClass]="containerClass"><map-layout /></div>`
})
export class WidgetComponent {

    constructor(
        public layoutService: LayoutService,
    ) { }

    public get containerClass(): any {
        return {
            'layout-light': !this.layoutService.config().darkTheme,
            'layout-dark': this.layoutService.config().darkTheme,
            'layout-colorscheme-menu':
                this.layoutService.config().menuTheme === 'colorScheme',
            'layout-primarycolor-menu':
                this.layoutService.config().menuTheme === 'primaryColor',
            'layout-transparent-menu':
                this.layoutService.config().menuTheme === 'transparent',
            'layout-overlay':
                this.layoutService.config().menuMode === 'overlay',
            'layout-static': this.layoutService.config().menuMode === 'static',
            'layout-slim': this.layoutService.config().menuMode === 'slim',
            'layout-slim-plus':
                this.layoutService.config().menuMode === 'slim-plus',
            'layout-horizontal':
                this.layoutService.config().menuMode === 'horizontal',
            'layout-reveal': this.layoutService.config().menuMode === 'reveal',
            'layout-drawer': this.layoutService.config().menuMode === 'drawer',
            'layout-static-inactive':
                this.layoutService.state.staticMenuDesktopInactive &&
                this.layoutService.config().menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active':
                this.layoutService.state.staticMenuMobileActive,
            'layout-sidebar-active': this.layoutService.state.sidebarActive,
            'layout-sidebar-anchored': this.layoutService.state.anchored,
            'layout-map-overlay-active': this.layoutService.isMapSidebar(),
        };
    }
}

