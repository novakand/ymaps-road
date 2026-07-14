import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LayerStateService {

    private readonly _layers = new BehaviorSubject({
        intersections: true,
        active: true,
        axle: false,
        alternative: true,
        axleBbox: false

    });

    readonly layers$ = this._layers.asObservable();

    public get value() {
        return this._layers.value;
    }

    public update(partial: Partial<typeof this._layers.value>): void {
        this._layers.next({
            ...this._layers.value,
            ...partial,

        });

    }

}