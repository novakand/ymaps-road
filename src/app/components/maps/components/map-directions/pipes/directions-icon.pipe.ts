import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'directionsIcon',
    standalone: true
})
export class DirectionsIconPipe implements PipeTransform {

    public transform(step: any): string {

        const action = step?.properties?.action?.value;

        if (!action) {
            return '';
        }

        switch (action) {

            case 'straight':
                return 'straight';

            case 'left':
                return 'left';

            case 'right':
                return 'right';

            case 'slightLeft':
                return 'slight-left';

            case 'slightRight':
                return 'slight-right';

            case 'hardLeft':
                return 'sharp-left';

            case 'hardRight':
                // отдельной sharp-right.svg нет
                return 'right';

            case 'uturn':
                return 'left';

            case 'merge':
                return 'straight';

            case 'fork':
                return 'straight';

            case 'exit':
                return 'right';

            case 'enter roundabout':
                return 'roundabout';

            case 'arrive':
                return 'arrive';

            case 'depart':
                return 'depart';

            case 'waypoint':
                return 'waypoint';

            default:
                return 'straight';

        }

    }

}