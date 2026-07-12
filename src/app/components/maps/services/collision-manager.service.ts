// collision-manager.service.ts

import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { auditTime, debounceTime, filter, takeUntil } from 'rxjs/operators';
import RBush from 'rbush';
import { MapEventManager } from './map-event-manager';
import { MapService } from './map-service';

interface CollisionBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    id: string;
}

interface CollisionItem {
    id: string;
    el: HTMLElement;
    priority: number;
}

@Injectable({ providedIn: 'root' })
export class CollisionManagerService implements OnDestroy {

    private tree = new RBush<CollisionBox>();
    private items = new Map<string, CollisionItem>();
    private destroy$ = new Subject<void>();

    private eventManager = new MapEventManager(inject(NgZone));
    private update$ =
        this.eventManager.getLazyEmitter<{
            location: { zoom: number };
            mapInAction: boolean;
        }>('onUpdate');

    constructor(
        private mapService: MapService,
        private ngZone: NgZone
    ) {
        this.watchMap();
    }

    // =============================
    // Public API
    // =============================

    register(id: string, el: HTMLElement, priority = 0) {
        this.items.set(id, { id, el, priority });
    }

    unregister(id: string) {
        this.items.delete(id);
    }

    forceUpdate() {
        this.update();
    }

    // =============================
    // Map subscription
    // =============================

    private watchMap() {
        this.mapService.load$
            .pipe(
                filter(Boolean),
                takeUntil(this.destroy$)
            )
            .subscribe((mapInstance: any) => {

                this.eventManager.setTarget(mapInstance);

                // ⚠ важно — сбросить старые события
                this.update$
                    .pipe(
                        auditTime(16),
                        takeUntil(this.destroy$)
                    )
                    .subscribe(() => {
                        this.ngZone.runOutsideAngular(() => {
                            this.update();
                        });
                    });

            });
    }

    // =============================
    // Collision core
    // =============================

    private update() {
        this.tree.clear();

        const sorted = Array.from(this.items.values())
            .sort((a, b) => b.priority - a.priority);

        // 1️⃣ Сначала показываем все элементы
        for (const item of sorted) {
            item.el.style.display = '';
        }

        // 2️⃣ Теперь считаем collision
        for (const item of sorted) {
            const rect = item.el.getBoundingClientRect();

            if (!rect.width || !rect.height) continue;

            const box: CollisionBox = {
                minX: rect.left,
                minY: rect.top,
                maxX: rect.right,
                maxY: rect.bottom,
                id: item.id
            };

            const collision = this.tree.search(box);

            if (collision.length === 0) {
                this.tree.insert(box);
            } else {
                item.el.style.display = 'none';
            }
        }
    }

    // =============================

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}