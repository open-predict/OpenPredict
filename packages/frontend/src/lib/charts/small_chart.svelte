<script lang="ts">
    import type { marketPricePoint } from "@am/backend/types/market";
    import {
        line,
        curveLinear,
        Delaunay,
        Voronoi,
        pointer,
        range,
        area,
        bisector,
        scaleLinear,
        scaleUtc,
        type ScaleTime,
        type ScaleLinear,
    } from "d3";

    import { resampleOpMarketPricePoints as resample, PriceHistoryTerm } from "$lib/charts/utils";
    import log from "$lib/log";

    export let priceData: marketPricePoint[];
    export let term: PriceHistoryTerm = PriceHistoryTerm.ALL;

    const FILE = "small_chart";

    $: data = resample(priceData, term);
    $: lastDp = data.length > 0 ? data[data.length - 1] : null;

    const marginTop = 4;
    const marginRight = 0;
    const marginBottom = 4;
    const marginLeft = 2;
    const inset = 0;
    const strokeWidth = 2;
    const yScalefactor = 2;
    const xType = scaleUtc; // type of x-scale
    const yType = scaleLinear; // type of y-scale
    const curve = curveLinear; // method of interpolation between points

    let width = 200;
    let height = 0;

    let lines: {
            area: string | null;
            line: string | null;
        }[],
        points: { x: Date; y: number }[] = [],
        xDomain: Date[],
        yDomain: number[],
        xScale: ScaleTime<number, number, never>,
        yScale: ScaleLinear<number, number, never>,
        pointsScaled: ArrayLike<any>,
        voronoiGrid: Voronoi<Delaunay.Point>,
        xTicks: Date[],
        xTicksFormatted: string[],
        yTicks: number[],
        graphReady: boolean = false;

    $: width, height, createGraph();

    function createGraph() {
        log("debug", FILE, " Creating graph...")
        if (data.length > 0) {
            const yVals = data.map((el) => el.chance);
            const xVals = data.map((el) => el.date);
            const xRange = [marginLeft + inset, width - marginRight - inset];
            const yRange = [height - marginBottom - inset, marginTop + inset];
            const xScalefactor = width / 100; //y-axis number of values

            xDomain = [xVals[0], xVals[xVals.length - 1]];
            yDomain = [0, 100];

            xScale = xType(xDomain, xRange);
            yScale = yType(yDomain, yRange);

            const niceY = scaleLinear().domain(yDomain).nice();

            const gaps = (d: any, i: any) =>
                xVals[i] instanceof Date && !isNaN(yVals[i]);

            points = data.map((el) => ({
                x: el.date,
                y: el.chance,
            }));

            const cleanData = points.map(gaps);
            const chartLine = line()
                .defined((i: any) => cleanData[i])
                .curve(curve)
                .x((i: any) => xScale(xVals[i]))
                .y((i: any) => yScale(yVals[i]));

            const chartArea = area()
                .defined((i: any) => cleanData[i])
                .curve(curve)
                .x((i: any) => xScale(xVals[i]))
                .y0(yScale(0))
                .y1((i: any) => yScale(yVals[i]));

            const I: any[] = range(xVals.length);
            const newLine = chartLine(I);
            const newArea = chartArea(I);
            lines = [
                {
                    line: newLine,
                    area: newArea,
                },
            ];

            pointsScaled = points.map((el) => [xScale(el.x), yScale(el.y)]);
            const delaunayGrid = Delaunay.from(pointsScaled);
            voronoiGrid = delaunayGrid.voronoi([0, 0, width, height]);

            xTicks = xScale.ticks(xScalefactor);

            xTicksFormatted = xTicks.map(
                (el) => `${el.getUTCMonth() + 1}/${el.getDate()}`
            );

            yTicks = niceY.ticks(yScalefactor);

            graphReady = true;
        }
    }
</script>

<div class="min-w-full block h-full" bind:clientWidth={width} bind:clientHeight={height}>
    {#if graphReady}
        <svg {width} {height} viewBox="0 0 {width} {height}">
            <!-- Chart lines -->
            {#each lines as lineArea, i}
                <g class="chartlines" pointer-events="none">
                    <path
                        class={lastDp && lastDp.chance > 49.9
                            ? "stroke-emerald-400"
                            : "stroke-red-600"}
                        fill="none"
                        d={lineArea.line}
                        stroke-opacity={1}
                        stroke-width={strokeWidth}
                        stroke-linecap={"round"}
                        stroke-linejoin={"round"}
                    />
                </g>
            {/each}

            <!-- Y-axis and horizontal grid lines -->
            <g
                class="y-axis"
                transform="translate({marginLeft}, 0)"
                pointer-events="none"
            >
                {#each yTicks as tick, i}
                    {#if i === 1}
                        <g
                            class="tick"
                            transform="translate(0, {yScale(tick)})"
                        >
                            <line
                                class="tick-grid"
                                x1={inset}
                                x2={width - marginLeft - marginRight}
                            />
                        </g>
                    {/if}
                {/each}
            </g>
        </svg>
    {/if}
</div>

<style>
    svg {
        max-width: 100%;
        height: auto;
        height: "intrinsic";
        margin: auto;
    }
    path {
        fill: "green";
    }
    .tick {
        opacity: 1;
    }
    .tick-grid {
        stroke: gray;
        stroke-width: 1;
        stroke-opacity: 0.5;
        stroke-dasharray: 4;
        color: black;
    }
</style>
