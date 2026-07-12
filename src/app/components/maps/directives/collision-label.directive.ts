// collision-label.directive.ts

import {
    Directive,
    ElementRef,
    Input,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import { CollisionManagerService } from '../services/collision-manager.service';

@Directive({
    selector: '[appCollisionLabel]',
    standalone: true
})
export class CollisionLabelDirective
    implements AfterViewInit, OnDestroy {

    @Input('appCollisionLabel') id!: string;
    @Input() collisionPriority = 0;

    constructor(
        private el: ElementRef<HTMLElement>,
        private collision: CollisionManagerService
    ) { }

    ngAfterViewInit() {
        this.collision.register(
            this.id,
            this.el.nativeElement,
            this.collisionPriority
        );
    }

    ngOnDestroy() {
        this.collision.unregister(this.id);
    }
}