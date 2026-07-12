import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDirectionPoint, IDirectionState } from '../interfaces/direction-state.interface';
import { initialState } from '../constants/initial-state.constant';

@Injectable({
    providedIn: 'root',
})
export class DirectionStateService {

    private stateSubject =
        new BehaviorSubject<IDirectionState>(initialState);

    public state$ =
        this.stateSubject.asObservable();

    public getState(): IDirectionState {

        return this.stateSubject.getValue();

    }


    public setFocusedStep(
        step: any | null
    ): void {

        this.updateState({

            focusedStep: step

        });

    }

    public setHoveredStep(
        step: any | null
    ): void {

        this.updateState({

            hoveredStep: step

        });

    }


    public clearHoveredStep(): void {

        this.setHoveredStep(null);

    }

    public clearFocusedStep(): void {

        this.setFocusedStep(null);

    }

    public updateState(
        partialState: Partial<IDirectionState>
    ): void {

        this.stateSubject.next({

            ...this.getState(),

            ...partialState

        });

    }

    public setOptions(
        options: Partial<IDirectionState>
    ): void {

        this.updateState(options);

    }

    public setProfile(
        profile: string
    ): void {

        this.updateState({ profile });

    }

    public setOrigin(
        origin: IDirectionPoint
    ): void {

        this.updateState({

            origin,

            hoverMarker: {}

        });

    }

    public setDestination(
        destination: IDirectionPoint
    ): void {

        this.updateState({

            destination,

            hoverMarker: {}

        });

    }

    public clearOrigin(): void {

        this.updateState({

            origin: {

                value: null,

                label: ''

            },

            originQuery: '',

            hoverWaypoints: [],

            directions: null

        });

    }

    public clearDestination(): void {

        this.updateState({

            destination: {

                value: null,

                label: ''

            },

            destinationQuery: '',

            hoverWaypoints: [],

            directions: null

        });

    }

    public setError(
        error: string | null
    ): void {

        this.updateState({

            error

        });

    }

    public destroy(): void {

        this.stateSubject.next(initialState);

    }

}