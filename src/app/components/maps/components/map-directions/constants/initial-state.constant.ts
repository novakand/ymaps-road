import { IDirectionState } from "../interfaces/direction-state.interface";
export const initialState: IDirectionState = {
    api: '',
    profile: 'driving',
    alternatives: true,
    congestion: false,
    unit: 'metric',
    flyTo: true,
    placeholderOrigin: 'Choose a starting place',
    placeholderDestination: 'Choose destination',
    focusedStep: null,
    hoveredStep: null,
    zoom: 16,
    language: 'ru',
    compile: null,
    proximity: false,
    styles: [],

    controls: {
        profileSwitcher: true,
        instructions: true,
    },

    instructions: {
        showWaypointInstructions: true,
    },

    geocoder: {},
    interactive: true,
    events: {},

    origin: {
        value: null,
        label: ''
    },

    destination: {
        value: null,
        label: ''
    },

    hoverMarker: {},

    waypoints: [],

    hoverWaypoints: [],

    originQuery: null,
    destinationQuery: null,
    originQueryCoordinates: null,
    destinationQueryCoordinates: null,

    directions: null,

    redraw: false,

    fetchDirectionsRequest: null,

    routePadding: 80,

    error: null,
};