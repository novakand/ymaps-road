<?php

declare(strict_types=1);

namespace RouteGIS\Services;

use RouteGIS\Http\CurlClient;

final readonly class RoadAxleService
{
    private const WFS_BASE_URL = 'https://xn--d1aluo.xn--p1ai/api-geoserver/skdf_open/wfs';

    private const MAX_FEATURES = 1000;
    private const MAX_PAGES = 100;
    private const MAX_BBOX_SIZE_DEGREES = 1.0;
    private const EARTH_RADIUS_METERS = 6371008.8;
    private const CANDIDATE_DISTANCE_METERS = 60.0;

    private const ASSIGN_DISTANCE_METERS = 60.0;

    private const MAX_ANGLE_DIFF = 40.0;

    private const MIN_PART_COVERAGE = 0.60;

    private const SAMPLE_STEP_METERS = 80.0;

    private const MAX_SAMPLE_POINTS = 31;

    private const MATCH_WINDOW_METERS = 900.0;

    private const MIN_WINDOW_METERS = 80.0;

    private const ASSIGN_FALLBACK_DISTANCE_METERS = 100.0;
    private const ASSIGN_FALLBACK_ANGLE_DIFF = 55.0;

    private const DEBUG_TOP_CANDIDATES = 8;

    private const LAYER_LOAD_MAP = [
        'lyr_road_conditions_os_6' => 6.0,
        'lyr_road_conditions_os_10' => 10.0,
        'lyr_road_conditions_os_11_5' => 11.5,
    ];

    public function __construct(
        private CurlClient $http,
    ) {
        ini_set('error_log', __DIR__ . '/logs/road_axle_wfs.log');
    }

    public function analyze(
        array $routeFeatures,
        array $bounds4326,
        int $zoom,
        int $chunkIndex = 0,
    ): array {
        $bounds4326 = $this->normalizeBounds4326($bounds4326);

        if ($bounds4326 === null) {
            error_log('Invalid route BBOX');
            return $this->createEmptyFeatureCollection();
        }

        $bounds4326 = $this->limitBounds4326($bounds4326);

        error_log(sprintf(
            '=== RoadAxleWfsService::analyze === bounds4326=[%s], zoom=%d',
            implode(', ', $bounds4326),
            $zoom,
        ));

        $roads = $this->getAllRoads($bounds4326);

        if ($roads === []) {
            error_log('No WFS roads loaded');
            return $this->createEmptyFeatureCollection();
        }

        $featuresByPartId = $this->groupFeaturesByPartId($roads);
        $routeSegments = $this->extractRouteSegments($routeFeatures);

        error_log(sprintf(
            'Loaded %d WFS features, %d part_id groups, %d route segments',
            count($roads),
            count($featuresByPartId),
            count($routeSegments),
        ));

        if ($routeSegments === [] || $featuresByPartId === []) {
            return $this->createEmptyFeatureCollection();
        }

        $coloredSegments = $this->matchAndColorRoute(
            $routeSegments,
            $featuresByPartId,
        );

        error_log(sprintf(
            'Created %d colored Yandex route segments',
            count($coloredSegments),
        ));

        return $this->buildFeatureCollection(
            $coloredSegments,
            $chunkIndex,
        );
    }

    private function matchAndColorRoute(
        array $routeSegments,
        array $featuresByPartId,
    ): array {
        $result = [];
        $previousPartId = null;

        foreach ($routeSegments as $segmentIndex => $routeSegment) {
            $points = $routeSegment['points'];

            if (count($points) < 2) {
                continue;
            }

            $windows = $this->splitLineIntoWindows(
                $points,
                self::MATCH_WINDOW_METERS,
            );

            error_log(sprintf(
                'SEGMENT %d: points=%d length=%.1fm windows=%d previousPart=%s',
                $segmentIndex,
                count($points),
                $this->calculateLineLength($points),
                count($windows),
                $previousPartId ?? 'null',
            ));

            foreach ($windows as $windowIndex => $windowPoints) {
                if (count($windowPoints) < 2) {
                    continue;
                }

                $windowLength = $this->calculateLineLength($windowPoints);
                $samples = $this->sampleLineByDistance($windowPoints);
                $context = sprintf('S%d/W%d', $segmentIndex, $windowIndex);

                error_log(sprintf(
                    '%s START: points=%d samples=%d length=%.1fm previousPart=%s',
                    $context,
                    count($windowPoints),
                    count($samples),
                    $windowLength,
                    $previousPartId ?? 'null',
                ));

                $match = $this->findBestPartMatch(
                    samplePoints: $samples,
                    routePoints: $windowPoints,
                    featuresByPartId: $featuresByPartId,
                    previousPartId: $previousPartId,
                    context: $context,
                );

                if ($match === null) {
                    error_log(sprintf(
                        '%s RESULT: no reliable part_id match',
                        $context,
                    ));
                    $previousPartId = null;
                    continue;
                }

                $partId = $match['part_id'];

                error_log(sprintf(
                    '%s RESULT: part_id=%s road="%s" coverage=%.0f%% longestRun=%.0f%% matched=%d/%d median=%.2fm p90=%.2fm angle=%.1f score=%.3f previous=%s',
                    $context,
                    $partId,
                    $match['road_name'],
                    $match['coverage'] * 100.0,
                    $match['longest_run_ratio'] * 100.0,
                    $match['matched'],
                    $match['sample_count'],
                    $match['median_distance'],
                    $match['p90_distance'],
                    $match['median_angle'],
                    $match['score'],
                    $previousPartId ?? 'null',
                ));

                $colored = $this->colorOriginalRouteByPart(
                    routePoints: $windowPoints,
                    features: $featuresByPartId[$partId],
                    segmentIndex: $segmentIndex,
                    partId: $partId,
                    context: $context,
                );

                if ($colored === []) {
                    error_log(sprintf(
                        '%s COLOR: selected part_id=%s but produced no colored geometry',
                        $context,
                        $partId,
                    ));
                }

                foreach ($colored as $item) {
                    $result[] = $item;
                }

                $previousPartId = $partId;
            }
        }

        return $this->mergeAdjacentColoredSegments($result);
    }

    private function findBestPartMatch(
        array $samplePoints,
        array $routePoints,
        array $featuresByPartId,
        ?string $previousPartId,
        string $context = '',
    ): ?array {
        if ($samplePoints === []) {
            return null;
        }

        $routeAngle = $this->calculateLineAngle($routePoints);
        $candidates = [];
        $sampleCount = count($samplePoints);
        $rejectStats = [
            'no_match' => 0,
            'coverage' => 0,
            'distance' => 0,
            'angle' => 0,
        ];

        foreach ($featuresByPartId as $partId => $features) {
            $distances = [];
            $angles = [];
            $matchedMask = [];

            foreach ($samplePoints as $sampleIndex => $point) {
                $localRouteAngle = $this->calculateRouteAngleAtSample(
                    $samplePoints,
                    $sampleIndex,
                    $routeAngle,
                );

                $projection = $this->projectPointToFeatures(
                    point: $point,
                    features: $features,
                    requiredAngle: $localRouteAngle,
                    maxDistance: self::CANDIDATE_DISTANCE_METERS,
                    maxAngleDiff: self::MAX_ANGLE_DIFF,
                );

                if ($projection === null) {
                    $matchedMask[] = false;
                    continue;
                }

                $matchedMask[] = true;
                $distances[] = $projection['distance'];
                $angles[] = $projection['angle_diff'];
            }

            $matched = count($distances);

            if ($matched === 0) {
                $rejectStats['no_match']++;
                continue;
            }

            $coverage = $matched / $sampleCount;
            $longestRun = $this->longestTrueRun($matchedMask);
            $longestRunRatio = $longestRun / $sampleCount;
            $medianDistance = $this->percentile($distances, 0.50);
            $p90Distance = $this->percentile($distances, 0.90);
            $medianAngle = $this->percentile($angles, 0.50);

            if ($coverage < self::MIN_PART_COVERAGE) {
                $rejectStats['coverage']++;
                continue;
            }

            if (
                $medianDistance > self::ASSIGN_DISTANCE_METERS ||
                $p90Distance > self::CANDIDATE_DISTANCE_METERS
            ) {
                $rejectStats['distance']++;
                continue;
            }

            if ($medianAngle > self::MAX_ANGLE_DIFF) {
                $rejectStats['angle']++;
                continue;
            }

            $coveragePenalty = (1.0 - $coverage) * 120.0;
            $continuityPenalty = (1.0 - $longestRunRatio) * 45.0;
            $distancePenalty = $medianDistance + ($p90Distance * 0.35);
            $anglePenalty = $medianAngle * 0.75;

            $samePartBonus = (
                $previousPartId !== null &&
                (string) $partId === $previousPartId
            ) ? 8.0 : 0.0;

            $attributeBonus = $this->calculateAttributeTieBreaker($features);

            $score = $coveragePenalty
                + $continuityPenalty
                + $distancePenalty
                + $anglePenalty
                - $samePartBonus
                - $attributeBonus;

            $properties = $features[0]['properties'] ?? [];

            $candidates[] = [
                'part_id' => (string) $partId,
                'road_name' => (string) ($properties['road_name'] ?? ''),
                'coverage' => $coverage,
                'longest_run_ratio' => $longestRunRatio,
                'matched' => $matched,
                'sample_count' => $sampleCount,
                'median_distance' => $medianDistance,
                'p90_distance' => $p90Distance,
                'median_angle' => $medianAngle,
                'attribute_bonus' => $attributeBonus,
                'same_part_bonus' => $samePartBonus,
                'score' => $score,
            ];
        }

        if ($candidates === []) {
            error_log(sprintf(
                '%s CANDIDATES: none; rejected noMatch=%d coverage=%d distance=%d angle=%d',
                $context,
                $rejectStats['no_match'],
                $rejectStats['coverage'],
                $rejectStats['distance'],
                $rejectStats['angle'],
            ));
            return null;
        }

        usort(
            $candidates,
            static fn(array $a, array $b): int =>
            $a['score'] <=> $b['score'],
        );

        foreach (array_slice($candidates, 0, self::DEBUG_TOP_CANDIDATES) as $rank => $candidate) {
            error_log(sprintf(
                '%s CANDIDATE #%d part=%s road="%s" matched=%d/%d coverage=%.0f%% run=%.0f%% med=%.2fm p90=%.2fm angle=%.1f attr=%.2f prevBonus=%.1f score=%.3f',
                $context,
                $rank + 1,
                $candidate['part_id'],
                $candidate['road_name'],
                $candidate['matched'],
                $candidate['sample_count'],
                $candidate['coverage'] * 100.0,
                $candidate['longest_run_ratio'] * 100.0,
                $candidate['median_distance'],
                $candidate['p90_distance'],
                $candidate['median_angle'],
                $candidate['attribute_bonus'],
                $candidate['same_part_bonus'],
                $candidate['score'],
            ));
        }

        return $candidates[0];
    }

    private function colorOriginalRouteByPart(
        array $routePoints,
        array $features,
        int $segmentIndex,
        string $partId,
        string $context = '',
    ): array {
        $result = [];
        $current = null;
        $previousFeatureKey = null;

        for ($i = 0, $count = count($routePoints) - 1; $i < $count; $i++) {
            $a = $routePoints[$i];
            $b = $routePoints[$i + 1];
            $midpoint = [
                ($a[0] + $b[0]) / 2.0,
                ($a[1] + $b[1]) / 2.0,
            ];
            $routeAngle = $this->calculateSegmentAngle($a, $b);

            $projection = $this->projectPointToFeatures(
                point: $midpoint,
                features: $features,
                requiredAngle: $routeAngle,
                maxDistance: self::ASSIGN_DISTANCE_METERS,
                maxAngleDiff: self::MAX_ANGLE_DIFF,
                preferredFeatureKey: $previousFeatureKey,
            );

            if ($projection === null) {
                $projectionA = $this->projectPointToFeatures(
                    point: $a,
                    features: $features,
                    requiredAngle: $routeAngle,
                    maxDistance: self::ASSIGN_FALLBACK_DISTANCE_METERS,
                    maxAngleDiff: self::ASSIGN_FALLBACK_ANGLE_DIFF,
                    preferredFeatureKey: $previousFeatureKey,
                );
                $projectionB = $this->projectPointToFeatures(
                    point: $b,
                    features: $features,
                    requiredAngle: $routeAngle,
                    maxDistance: self::ASSIGN_FALLBACK_DISTANCE_METERS,
                    maxAngleDiff: self::ASSIGN_FALLBACK_ANGLE_DIFF,
                    preferredFeatureKey: $previousFeatureKey,
                );

                if ($projectionA !== null || $projectionB !== null) {
                    if ($projectionA === null) {
                        $projection = $projectionB;
                    } elseif ($projectionB === null) {
                        $projection = $projectionA;
                    } else {
                        $projection = $projectionA['score'] <= $projectionB['score']
                            ? $projectionA
                            : $projectionB;
                    }

                    error_log(sprintf(
                        '%s COLOR fallback part=%s routeSeg=%d distance=%.2fm angle=%.1f',
                        $context,
                        $partId,
                        $i,
                        $projection['distance'],
                        $projection['angle_diff'],
                    ));
                }
            }

            if ($projection === null) {
                error_log(sprintf(
                    '%s COLOR gap part=%s routeSeg=%d a=[%.6f,%.6f] b=[%.6f,%.6f]',
                    $context,
                    $partId,
                    $i,
                    $a[0],
                    $a[1],
                    $b[0],
                    $b[1],
                ));

                if ($current !== null) {
                    $this->flushColoredSegment($result, $current);
                    $current = null;
                }
                $previousFeatureKey = null;
                continue;
            }

            $feature = $projection['feature'];
            $properties = $feature['properties'] ?? [];
            $featureKey = $this->getFeatureKey($feature);
            $load = (float) ($properties['os'] ?? 0.0);
            $color = $this->resolveStatusColor($load);
            $measure = $this->calculateMeasureMeters($projection, $feature);

            $styleKey = implode('|', [
                $featureKey,
                (string) $load,
                $color,
            ]);

            if ($current === null || $current['style_key'] !== $styleKey) {
                if ($current !== null) {
                    $this->flushColoredSegment($result, $current);
                }

                $current = [
                    'style_key' => $styleKey,
                    'points' => [$a, $b],
                    'color' => $color,
                    'road_properties' => [
                        'max_axle_load' => $load,
                        'load_category' => $load . 't',
                        'road_id' => $properties['road_id'] ?? null,
                        'road_name' => $properties['road_name'] ?? null,
                        'part_id' => $partId,
                        'feature_id' => $properties['id'] ?? null,
                        'source_layer' => $properties['source_layer'] ?? null,
                        'segment_index' => $segmentIndex,
                        'measure_start' => $measure,
                        'measure_end' => $measure,
                        'match_distance' => $projection['distance'],
                        'match_angle_diff' => $projection['angle_diff'],
                    ],
                ];
            } else {
                $lastPoint = $current['points'][count($current['points']) - 1];
                if (!$this->pointsEqual($lastPoint, $b)) {
                    $current['points'][] = $b;
                }
                $current['road_properties']['measure_end'] = $measure;
                $current['road_properties']['match_distance'] = max(
                    (float) $current['road_properties']['match_distance'],
                    $projection['distance'],
                );
            }

            $previousFeatureKey = $featureKey;
        }

        if ($current !== null) {
            $this->flushColoredSegment($result, $current);
        }

        return $result;
    }

    private function splitLineIntoWindows(
        array $points,
        float $windowMeters,
    ): array {
        if (count($points) < 2) {
            return [];
        }

        $cumulative = [0.0];
        for ($i = 1, $count = count($points); $i < $count; $i++) {
            $cumulative[$i] = $cumulative[$i - 1]
                + $this->haversineDistance($points[$i - 1], $points[$i]);
        }

        $totalLength = $cumulative[count($cumulative) - 1];
        if ($totalLength <= $windowMeters) {
            return [$points];
        }

        $windows = [];
        for ($start = 0.0; $start < $totalLength; $start += $windowMeters) {
            $end = min($totalLength, $start + $windowMeters);
            $window = $this->sliceLineByDistance($points, $cumulative, $start, $end);

            if (count($window) >= 2) {
                $windows[] = $window;
            }
        }

        if (count($windows) >= 2) {
            $lastIndex = count($windows) - 1;
            $lastLength = $this->calculateLineLength($windows[$lastIndex]);

            if ($lastLength < self::MIN_WINDOW_METERS) {
                $tail = array_shift($windows[$lastIndex]);
                unset($tail);
                $windows[$lastIndex - 1] = array_merge(
                    $windows[$lastIndex - 1],
                    $windows[$lastIndex],
                );
                array_pop($windows);
            }
        }

        return $windows;
    }

    private function sliceLineByDistance(
        array $points,
        array $cumulative,
        float $startDistance,
        float $endDistance,
    ): array {
        $slice = [
            $this->interpolatePointAlongLine($points, $cumulative, $startDistance),
        ];

        for ($i = 1, $count = count($points); $i < $count - 1; $i++) {
            if (
                $cumulative[$i] > $startDistance &&
                $cumulative[$i] < $endDistance
            ) {
                $slice[] = $points[$i];
            }
        }

        $endPoint = $this->interpolatePointAlongLine(
            $points,
            $cumulative,
            $endDistance,
        );

        if (!$this->pointsEqual($slice[count($slice) - 1], $endPoint)) {
            $slice[] = $endPoint;
        }

        return $slice;
    }

    private function calculateLineLength(array $points): float
    {
        $length = 0.0;
        for ($i = 1, $count = count($points); $i < $count; $i++) {
            $length += $this->haversineDistance($points[$i - 1], $points[$i]);
        }

        return $length;
    }

    private function longestTrueRun(array $mask): int
    {
        $best = 0;
        $current = 0;

        foreach ($mask as $matched) {
            if ($matched) {
                $current++;
                $best = max($best, $current);
            } else {
                $current = 0;
            }
        }

        return $best;
    }

    private function calculateAttributeTieBreaker(array $features): float
    {
        $properties = $features[0]['properties'] ?? [];
        $bonus = 0.0;

        if (($properties['skeleton'] ?? null) === 'Опорная сеть') {
            $bonus += 1.5;
        }

        if (in_array(($properties['is_checked'] ?? null), ['Y', '1', 1], true)) {
            $bonus += 0.5;
        }

        $lanes = (int) ($properties['lanes'] ?? 0);
        $bonus += min(max($lanes, 0), 4) * 0.25;

        $width = max(
            (float) ($properties['roadway_width'] ?? 0.0),
            (float) ($properties['roadbed_width'] ?? 0.0),
        );
        $bonus += min(max($width, 0.0) / 10.0, 1.0);

        $capacity = (float) ($properties['capacity'] ?? 0.0);
        if ($capacity > 0.0) {
            $bonus += min(log10(max($capacity, 1.0)) * 0.25, 1.0);
        }

        return min($bonus, 4.0);
    }

    private function mergeAdjacentColoredSegments(array $segments): array
    {
        $result = [];

        foreach ($segments as $segment) {
            if ($result === []) {
                $result[] = $segment;
                continue;
            }

            $lastIndex = count($result) - 1;
            $last = $result[$lastIndex];

            $sameStyle = ($last['color'] ?? null) === ($segment['color'] ?? null)
                && (($last['road_properties']['part_id'] ?? null)
                    === ($segment['road_properties']['part_id'] ?? null))
                && (($last['road_properties']['source_layer'] ?? null)
                    === ($segment['road_properties']['source_layer'] ?? null));

            $lastPoint = $last['points'][count($last['points']) - 1] ?? null;
            $firstPoint = $segment['points'][0] ?? null;

            if (
                $sameStyle &&
                is_array($lastPoint) &&
                is_array($firstPoint) &&
                $this->pointsEqual($lastPoint, $firstPoint)
            ) {
                $points = $segment['points'];
                array_shift($points);
                $result[$lastIndex]['points'] = array_merge(
                    $result[$lastIndex]['points'],
                    $points,
                );
                $result[$lastIndex]['road_properties']['measure_end'] =
                    $segment['road_properties']['measure_end'] ??
                    $result[$lastIndex]['road_properties']['measure_end'] ?? null;
                continue;
            }

            $result[] = $segment;
        }

        return $result;
    }

    private function flushColoredSegment(array &$result, array $segment): void
    {
        if (count($segment['points']) < 2) {
            return;
        }

        unset($segment['style_key']);
        $result[] = $segment;
    }

    private function projectPointToFeatures(
        array $point,
        array $features,
        float $requiredAngle,
        float $maxDistance,
        float $maxAngleDiff,
        ?string $preferredFeatureKey = null,
    ): ?array {
        $best = null;
        $bestScore = INF;

        foreach ($features as $feature) {
            $lines = $this->extractGeometryLines($feature['geometry'] ?? []);

            foreach ($lines as $line) {
                $projection = $this->projectPointToLine($point, $line);

                if ($projection === null || $projection['distance'] > $maxDistance) {
                    continue;
                }

                $roadAngle = $this->calculateLocalRoadAngle(
                    $line,
                    $projection['segment_index'],
                );

                if ($roadAngle === null) {
                    continue;
                }

                $angleDiff = $this->calculateUndirectedAngleDifference(
                    $requiredAngle,
                    $roadAngle,
                );

                if ($angleDiff > $maxAngleDiff) {
                    continue;
                }

                $featureKey = $this->getFeatureKey($feature);
                $continuityBonus = (
                    $preferredFeatureKey !== null &&
                    $featureKey === $preferredFeatureKey
                ) ? 4.0 : 0.0;

                $score = $projection['distance']
                    + ($angleDiff * 0.65)
                    - $continuityBonus;

                if ($score >= $bestScore) {
                    continue;
                }

                $bestScore = $score;
                $best = array_merge($projection, [
                    'feature' => $feature,
                    'line' => $line,
                    'road_angle' => $roadAngle,
                    'angle_diff' => $angleDiff,
                    'score' => $score,
                ]);
            }
        }

        return $best;
    }

    private function projectPointToLine(array $point, array $line): ?array
    {
        if (count($line) < 2) {
            return null;
        }

        $best = null;
        $bestDistance = INF;

        for ($i = 0, $count = count($line) - 1; $i < $count; $i++) {
            $a = $line[$i];
            $b = $line[$i + 1];

            if (count($a) < 2 || count($b) < 2) {
                continue;
            }

            $projection = $this->projectPointToSegment($point, $a, $b);

            if ($projection === null || $projection['distance'] >= $bestDistance) {
                continue;
            }

            $bestDistance = $projection['distance'];
            $best = array_merge($projection, [
                'segment_index' => $i,
            ]);
        }

        return $best;
    }

    private function projectPointToSegment(
        array $point,
        array $a,
        array $b,
    ): ?array {
        $lat0 = deg2rad(($point[1] + $a[1] + $b[1]) / 3.0);
        $kx = cos($lat0) * 111320.0;
        $ky = 110540.0;

        $ax = $a[0] * $kx;
        $ay = $a[1] * $ky;
        $bx = $b[0] * $kx;
        $by = $b[1] * $ky;
        $px = $point[0] * $kx;
        $py = $point[1] * $ky;

        $abx = $bx - $ax;
        $aby = $by - $ay;
        $lengthSquared = ($abx * $abx) + ($aby * $aby);

        if ($lengthSquared <= 0.0) {
            return null;
        }

        $t = ((($px - $ax) * $abx) + (($py - $ay) * $aby))
            / $lengthSquared;
        $t = max(0.0, min(1.0, $t));

        $projectedX = $ax + ($abx * $t);
        $projectedY = $ay + ($aby * $t);

        return [
            'distance' => hypot($px - $projectedX, $py - $projectedY),
            't' => $t,
            'point' => [
                $projectedX / $kx,
                $projectedY / $ky,
            ],
        ];
    }

    private function calculateMeasureMeters(
        array $projection,
        array $feature,
    ): ?float {
        $properties = $feature['properties'] ?? [];

        if (!isset($properties['start_km'], $properties['finish_km'])) {
            return null;
        }

        $line = $projection['line'] ?? [];
        $segmentIndex = (int) ($projection['segment_index'] ?? 0);
        $t = (float) ($projection['t'] ?? 0.0);

        if (count($line) < 2) {
            return null;
        }

        $lengths = [0.0];

        for ($i = 1, $count = count($line); $i < $count; $i++) {
            $lengths[$i] = $lengths[$i - 1]
                + $this->haversineDistance($line[$i - 1], $line[$i]);
        }

        $totalLength = $lengths[count($lengths) - 1];

        if ($totalLength <= 0.0) {
            return (float) $properties['start_km'] * 1000.0;
        }

        $segmentIndex = max(0, min($segmentIndex, count($line) - 2));
        $segmentLength = $lengths[$segmentIndex + 1] - $lengths[$segmentIndex];
        $positionMeters = $lengths[$segmentIndex] + ($segmentLength * $t);
        $fraction = max(0.0, min(1.0, $positionMeters / $totalLength));

        $startMeters = (float) $properties['start_km'] * 1000.0;
        $finishMeters = (float) $properties['finish_km'] * 1000.0;

        return $startMeters + (($finishMeters - $startMeters) * $fraction);
    }

    private function sampleLineByDistance(array $points): array
    {
        if (count($points) <= 2) {
            return $points;
        }

        $cumulative = [0.0];

        for ($i = 1, $count = count($points); $i < $count; $i++) {
            $cumulative[$i] = $cumulative[$i - 1]
                + $this->haversineDistance($points[$i - 1], $points[$i]);
        }

        $totalLength = $cumulative[count($cumulative) - 1];

        if ($totalLength <= 0.0) {
            return [$points[0], $points[count($points) - 1]];
        }

        $desiredCount = (int) ceil($totalLength / self::SAMPLE_STEP_METERS) + 1;
        $sampleCount = max(5, min(self::MAX_SAMPLE_POINTS, $desiredCount));
        $samples = [];

        for ($sampleIndex = 0; $sampleIndex < $sampleCount; $sampleIndex++) {
            $target = $sampleIndex === $sampleCount - 1
                ? $totalLength
                : ($totalLength * $sampleIndex / ($sampleCount - 1));

            $samples[] = $this->interpolatePointAlongLine(
                $points,
                $cumulative,
                $target,
            );
        }

        return $samples;
    }

    private function interpolatePointAlongLine(
        array $points,
        array $cumulative,
        float $targetDistance,
    ): array {
        $lastIndex = count($points) - 1;

        if ($targetDistance <= 0.0) {
            return $points[0];
        }

        if ($targetDistance >= $cumulative[$lastIndex]) {
            return $points[$lastIndex];
        }

        for ($i = 0; $i < $lastIndex; $i++) {
            if ($targetDistance > $cumulative[$i + 1]) {
                continue;
            }

            $segmentLength = $cumulative[$i + 1] - $cumulative[$i];
            $t = $segmentLength > 0.0
                ? ($targetDistance - $cumulative[$i]) / $segmentLength
                : 0.0;

            return [
                $points[$i][0] + (($points[$i + 1][0] - $points[$i][0]) * $t),
                $points[$i][1] + (($points[$i + 1][1] - $points[$i][1]) * $t),
            ];
        }

        return $points[$lastIndex];
    }

    private function calculateRouteAngleAtSample(
        array $samples,
        int $index,
        float $fallback,
    ): float {
        $count = count($samples);

        if ($count < 2) {
            return $fallback;
        }

        $start = $samples[max(0, $index - 1)];
        $end = $samples[min($count - 1, $index + 1)];

        if ($this->pointsEqual($start, $end)) {
            return $fallback;
        }

        return $this->calculateSegmentAngle($start, $end);
    }

    private function calculateLineAngle(array $points): float
    {
        return $this->calculateSegmentAngle(
            $points[0],
            $points[count($points) - 1],
        );
    }

    private function calculateLocalRoadAngle(
        array $line,
        int $segmentIndex,
    ): ?float {
        if (count($line) < 2) {
            return null;
        }

        $segmentIndex = max(0, min($segmentIndex, count($line) - 2));
        $startIndex = max(0, $segmentIndex - 1);
        $endIndex = min(count($line) - 1, $segmentIndex + 2);

        $start = $line[$startIndex];
        $end = $line[$endIndex];

        if ($this->pointsEqual($start, $end)) {
            return null;
        }

        return $this->calculateSegmentAngle($start, $end);
    }

    private function calculateSegmentAngle(array $a, array $b): float
    {
        $lat0 = deg2rad(($a[1] + $b[1]) / 2.0);
        $dx = ($b[0] - $a[0]) * cos($lat0);
        $dy = $b[1] - $a[1];

        $angle = rad2deg(atan2($dx, $dy));

        return $angle < 0.0 ? $angle + 360.0 : $angle;
    }

    private function calculateUndirectedAngleDifference(
        float $angle1,
        float $angle2,
    ): float {
        $diff = abs($angle1 - $angle2);
        $diff = min($diff, 360.0 - $diff);

        return min($diff, abs(180.0 - $diff));
    }

    private function percentile(array $values, float $percentile): float
    {
        if ($values === []) {
            return INF;
        }

        sort($values, SORT_NUMERIC);
        $index = (int) round((count($values) - 1) * $percentile);

        return (float) $values[$index];
    }

    private function extractRouteSegments(array $routeFeatures): array
    {
        $segments = [];

        foreach ($routeFeatures as $feature) {
            $geometry = $feature['geometry'] ?? null;

            if (!is_array($geometry)) {
                continue;
            }

            foreach ($this->extractGeometryLines($geometry) as $line) {
                if (count($line) >= 2) {
                    $segments[] = [
                        'points' => $line,
                        'properties' => $feature['properties'] ?? [],
                    ];
                }
            }
        }

        return $segments;
    }

    private function groupFeaturesByPartId(array $features): array
    {
        $grouped = [];

        foreach ($features as $feature) {
            $properties = $feature['properties'] ?? [];
            $partId = $properties['part_id']
                ?? $properties['road_part_id']
                ?? null;

            if ($partId === null || $partId === '') {
                continue;
            }

            $grouped[(string) $partId][] = $feature;
        }

        return $grouped;
    }

    private function extractGeometryLines(array $geometry): array
    {
        $type = $geometry['type'] ?? null;
        $coordinates = $geometry['coordinates'] ?? [];

        if ($type === 'LineString') {
            return count($coordinates) >= 2 ? [$coordinates] : [];
        }

        if ($type === 'MultiLineString') {
            return array_values(array_filter(
                $coordinates,
                static fn(array $line): bool => count($line) >= 2,
            ));
        }

        return [];
    }

    private function getFeatureKey(array $feature): string
    {
        $properties = $feature['properties'] ?? [];

        return (string) (
            $properties['id']
            ?? $feature['id']
            ?? spl_object_id((object) $feature)
        );
    }

    private function pointsEqual(array $a, array $b): bool
    {
        return abs($a[0] - $b[0]) < 1e-10
            && abs($a[1] - $b[1]) < 1e-10;
    }

    private function getAllRoads(array $bounds4326): array
    {
        $allFeatures = [];

        foreach (self::LAYER_LOAD_MAP as $layer => $load) {
            $features = $this->fetchLayer(
                layer: $layer,
                bounds4326: $bounds4326,
            );

            foreach ($features as $featureIndex => $feature) {
                if (!is_array($feature) || !isset($feature['geometry'])) {
                    continue;
                }

                $lines = $this->extractGeometryLines(
                    $feature['geometry'] ?? [],
                );

                if ($lines === []) {
                    error_log(sprintf(
                        'WFS feature skipped: layer=%s index=%d invalid geometry',
                        $layer,
                        $featureIndex,
                    ));
                    continue;
                }

                $properties = $feature['properties'] ?? [];
                if (!is_array($properties)) {
                    $properties = [];
                }

                $color = $this->resolveStatusColor($load);

                $properties['os'] = $load;
                $properties['load_category'] = $load . 't';
                $properties['source_layer'] = $layer;
                $properties['max_axle_load'] = $load;
                $properties['strokeColor'] = $color;
                $properties['strokeWidth'] = 8;
                $properties['strokeOpacity'] = 0.9;
                $properties['hintContent'] = $this->getHintContent($color);

                $sourceId = (string) (
                    $feature['id']
                    ?? $properties['id']
                    ?? $featureIndex
                );

                $feature['id'] = sprintf(
                    '%s-%s',
                    $layer,
                    $sourceId,
                );
                $feature['properties'] = $properties;
                $allFeatures[] = $feature;
            }

            error_log(sprintf(
                'Layer %s: loaded %d features',
                $layer,
                count($features),
            ));
        }

        return $allFeatures;
    }

    private function fetchLayer(
        string $layer,
        array $bounds4326,
    ): array {
        $allFeatures = [];
        $startIndex = 0;
        $pageCount = 0;
        $bbox = implode(',', $bounds4326) . ',EPSG:4326';

        while ($pageCount < self::MAX_PAGES) {
            $params = [
                'SERVICE' => 'WFS',
                'VERSION' => '2.0.0',
                'REQUEST' => 'GetFeature',
                'TYPENAME' => 'skdf_open:' . $layer,
                'OUTPUTFORMAT' => 'application/json',
                'SRSNAME' => 'EPSG:4326',
                'BBOX' => $bbox,
                'COUNT' => self::MAX_FEATURES,
                'STARTINDEX' => $startIndex,
                'SORTBY' => 'road_id A,start_km A',
            ];

            try {
                $response = $this->http->get(
                    self::WFS_BASE_URL,
                    $params,
                );
            } catch (\Throwable $exception) {
                error_log(sprintf(
                    'WFS request failed: layer=%s page=%d offset=%d error=%s',
                    $layer,
                    $pageCount,
                    $startIndex,
                    $exception->getMessage(),
                ));
                break;
            }

            $features = $response['features'] ?? [];

            if (!is_array($features)) {
                $features = [];
            }

            $returned = count($features);

            if ($returned === 0) {
                break;
            }

            $allFeatures = array_merge($allFeatures, $features);

            $numberMatched = $this->resolveNumberMatched(
                response: $response,
                returned: $returned,
            );

            error_log(sprintf(
                'WFS page: layer=%s page=%d offset=%d returned=%d matched=%d',
                $layer,
                $pageCount,
                $startIndex,
                $returned,
                $numberMatched,
            ));

            $startIndex += $returned;
            $pageCount++;

            if (
                $returned < self::MAX_FEATURES ||
                $startIndex >= $numberMatched
            ) {
                break;
            }
        }

        if ($pageCount >= self::MAX_PAGES) {
            error_log(sprintf(
                'Max pages reached for layer %s',
                $layer,
            ));
        }

        return $allFeatures;
    }

    private function normalizeBounds4326(array $bounds): ?array
    {
        if (count($bounds) < 4) {
            return null;
        }

        foreach (array_slice($bounds, 0, 4) as $value) {
            if (!is_numeric($value)) {
                return null;
            }
        }

        $west = (float) $bounds[0];
        $south = (float) $bounds[1];
        $east = (float) $bounds[2];
        $north = (float) $bounds[3];

        if ($west > $east) {
            [$west, $east] = [$east, $west];
        }

        if ($south > $north) {
            [$south, $north] = [$north, $south];
        }

        $west = max(-180.0, min(180.0, $west));
        $east = max(-180.0, min(180.0, $east));
        $south = max(-90.0, min(90.0, $south));
        $north = max(-90.0, min(90.0, $north));

        if (
            abs($east - $west) < 1e-10 ||
            abs($north - $south) < 1e-10
        ) {
            return null;
        }

        return [$west, $south, $east, $north];
    }

    private function limitBounds4326(array $bounds): array
    {
        [$west, $south, $east, $north] = $bounds;
        $width = $east - $west;
        $height = $north - $south;

        if (
            $width <= self::MAX_BBOX_SIZE_DEGREES &&
            $height <= self::MAX_BBOX_SIZE_DEGREES
        ) {
            return $bounds;
        }

        $centerLongitude = ($west + $east) / 2.0;
        $centerLatitude = ($south + $north) / 2.0;
        $halfWidth = min($width, self::MAX_BBOX_SIZE_DEGREES) / 2.0;
        $halfHeight = min($height, self::MAX_BBOX_SIZE_DEGREES) / 2.0;

        $limited = [
            $centerLongitude - $halfWidth,
            $centerLatitude - $halfHeight,
            $centerLongitude + $halfWidth,
            $centerLatitude + $halfHeight,
        ];

        error_log(sprintf(
            'Route BBOX truncated: original=[%s] limited=[%s]',
            implode(', ', $bounds),
            implode(', ', $limited),
        ));

        return $limited;
    }

    private function resolveNumberMatched(
        array $response,
        int $returned,
    ): int {
        $value = $response['numberMatched']
            ?? $response['totalFeatures']
            ?? null;

        if (is_int($value) || is_float($value)) {
            return max((int) $value, $returned);
        }

        if (is_string($value) && is_numeric($value)) {
            return max((int) $value, $returned);
        }

        return $returned === self::MAX_FEATURES
            ? PHP_INT_MAX
            : $returned;
    }

    private function haversineDistance(array $p1, array $p2): float
    {
        $lat1 = deg2rad($p1[1]);
        $lon1 = deg2rad($p1[0]);
        $lat2 = deg2rad($p2[1]);
        $lon2 = deg2rad($p2[0]);

        $dLat = $lat2 - $lat1;
        $dLon = $lon2 - $lon1;

        $a = sin($dLat / 2.0) ** 2
            + cos($lat1) * cos($lat2) * sin($dLon / 2.0) ** 2;
        $a = max(0.0, min(1.0, $a));
        $centralAngle = 2.0 * atan2(sqrt($a), sqrt(1.0 - $a));

        return self::EARTH_RADIUS_METERS * $centralAngle;
    }

    private function resolveStatusColor(float $axleLoad): string
    {
        if ($axleLoad <= 6.0) {
            return '#EF4444';
        }

        if ($axleLoad <= 10.0) {
            return '#F59E0B';
        }

        return '#22C55E';
    }

    private function getHintContent(string $color): string
    {
        return match ($color) {
            '#EF4444' => '⚠️ Критическое ограничение (≤ 6 т)',
            '#F59E0B' => '⚠️ Ограничение (6–10 т)',
            default => '✅ Проезд разрешен (> 10 т)',
        };
    }

    private function buildFeatureCollection(
        array $segments,
        int $chunkIndex,
    ): array {
        $features = [];

        foreach ($segments as $segmentIndex => $segment) {
            if (count($segment['points'] ?? []) < 2) {
                continue;
            }

            $properties = $segment['road_properties'] ?? [];

            $partId = (string) (
                $properties['part_id']
                ?? 'part'
            );

            $sourceLayer = (string) (
                $properties['source_layer']
                ?? 'layer'
            );

            $featureId = (string) (
                $properties['feature_id']
                ?? 'feature'
            );

            $features[] = [
                'type' => 'Feature',
                'id' => sprintf(
                    'route-axle-chunk-%d-segment-%d-part-%s-feature-%s-layer-%s',
                    $chunkIndex,
                    $segmentIndex,
                    $partId,
                    $featureId,
                    $sourceLayer,
                ),
                'properties' => array_merge(
                    [
                        'chunkIndex' => $chunkIndex,
                        'strokeColor' => $segment['color'],
                        'strokeWidth' => 8,
                        'strokeOpacity' => 0.9,
                        'hintContent' =>
                            $this->getHintContent(
                                $segment['color'],
                            ),
                    ],
                    $properties,
                ),
                'geometry' => [
                    'type' => 'LineString',
                    'coordinates' => $segment['points'],
                ],
            ];
        }

        return [
            'type' => 'FeatureCollection',
            'features' => $features,
        ];
    }

    private function createEmptyFeatureCollection(): array
    {
        return [
            'type' => 'FeatureCollection',
            'features' => [],
        ];
    }
}