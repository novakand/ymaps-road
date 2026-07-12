import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IRoadSelectionState {
    road: any[];
}

@Injectable({
    providedIn: 'root'
})
export class RoadSelectionStateService {

    private readonly _state$ = new BehaviorSubject<IRoadSelectionState>({
        road: [],
    });

    readonly state$ = this._state$.asObservable();

    public setSelection(
        road: any[] = []
    ): void {

        this._state$.next({
            road,
        });
    }

    public clear(): void {
        this._state$.next({
            road: [],
        });

    }
}