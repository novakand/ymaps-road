import { Injectable } from "@angular/core";
import { Feature } from "geojson";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MapService {

    public load$ = new BehaviorSubject<any>(null);

    public baseLayer$ =
        new BehaviorSubject<any>(
            'scheme'
        );


}
