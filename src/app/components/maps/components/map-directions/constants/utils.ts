export const utils = {
    validCoords: (coords: [number, number]): boolean => {
        return (
            Array.isArray(coords) &&
            coords.length === 2 &&
            !isNaN(coords[0]) &&
            !isNaN(coords[1])
        );
    },
    wrap: (coord: number): number => {
        return coord % 360;
    },
    createPoint: (coords: [number, number], properties: any): any => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coords,
            },
            properties,
        };
    },
    coordinateMatch(a, b) {
        a = a.geometry.coordinates;
        b = b.geometry.coordinates;
        return (a.join() === b.join()) ||
            a[0].toFixed(3) === b[0].toFixed(3) &&
            a[1].toFixed(3) === b[1].toFixed(3);
    },

    getAllSteps(feature, filterBy?) {
        return feature?.legs?.reduce((steps, leg, idx) => {
            if (idx > 0) {
                steps[steps.length - 1].maneuver.type = 'waypoint';
                leg.steps[0].maneuver.type = '';
            }

            const allSteps = steps.concat(leg.steps);

            if (filterBy) {
                return allSteps.filter(filterBy);
            } else {
                return allSteps;
            }
        }, []);
    },

    duration(s) {
        var m = Math.floor(s / 60),
            h = Math.floor(m / 60);
        s %= 60;
        m %= 60;
        if (h === 0 && m === 0) return s + 'с';
        if (h === 0) return m + 'мин';
        return h + ' ч ' + m + ' мин';
    },

    imperial(m) {
        var mi = m / 1609.344;
        if (mi >= 100) return mi.toFixed(0) + 'mi';
        if (mi >= 10) return mi.toFixed(1) + 'mi';
        if (mi >= 0.1) return mi.toFixed(2) + 'mi';
        return (mi * 5280).toFixed(0) + 'ft';
    },

    metric(m) {
        if (m >= 100000) return (m / 1000).toFixed(0) + ' км';
        if (m >= 10000) return (m / 1000).toFixed(1) + ' км';
        if (m >= 100) return (m / 1000).toFixed(2) + ' км';
        return m.toFixed(0) + 'm';
    }

};
