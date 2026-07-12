export interface IDirectionPoint {
    value: string | [number, number] | null;
    label: string;
    coordinates?: [number, number];
    data?: any;
}

export interface IDirectionState {
    api: string;
    profile: string;
    alternatives: boolean;
    congestion: boolean;
    unit: string;
    flyTo: boolean;
    placeholderOrigin: string;
    placeholderDestination: string;
    zoom: number;
    language: string;
    compile: any;
    proximity: boolean;
    styles: any[];
    staticMapUrl?: string;

    controls: {
        profileSwitcher: boolean;
        instructions: boolean;
    };

    instructions: {
        showWaypointInstructions: boolean;
    };

    geocoder: Record<string, any>;
    interactive: boolean;
    events: Record<string, any>;

    origin: IDirectionPoint;
    destination: IDirectionPoint;

    hoverMarker: any;

    waypoints: IDirectionPoint[];
    hoverWaypoints: IDirectionPoint[];

    originQuery: string | null;
    destinationQuery: string | null;
    originQueryCoordinates: any;
    destinationQueryCoordinates: any;
    focusedStep: any | null;

    hoveredStep: any | null;
    directions: any;
    redraw: boolean;
    fetchDirectionsRequest: any;

    routePadding: number;

    error?: string | null;
}