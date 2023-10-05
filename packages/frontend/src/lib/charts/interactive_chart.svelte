<script lang="ts">
    import type { marketPricePoint } from "@am/backend/types/market";
    import {
        line,
        curveLinear,
        Delaunay,
        Voronoi,
        range,
        area,
        scaleLinear,
        scaleUtc,
        type ScaleTime,
        type ScaleLinear,
    } from "d3";

    import { PriceHistoryTerm, resample } from "./utils";
    import { dateFormatter } from "$lib/utils";

    export let priceData: marketPricePoint[] = [];
    export let term: PriceHistoryTerm = PriceHistoryTerm.ALL;
    export let onScrub: (chance: number) => void = () => {};

    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 40;
    const marginLeft = 6;
    const inset = 0;
    const yFormat = "%";
    const strokeWidth = 3;
    const verticalGrid = true;
    const yScalefactor = 2;
    const xType = scaleUtc; // type of x-scale
    const yType = scaleLinear; // type of y-scale
    const curve = curveLinear; // method of interpolation between points

    let width = 600;
    let height = 200;

    $: workingWidth = width - inset - marginLeft - marginRight;
    $: data = resample(priceData, term);
    $: lastDp = data && data.length > 0 ? data[data.length - 1] : null;
    $: xScaledDotInfo = dotInfo ? xScale(points[dotInfo[1]].x) : undefined;

    let dotInfo: [number, number, any] | null,
        lines: {
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

    function createGraph() {
        try {
            if (lastDp && onScrub) onScrub(lastDp.chance);
            if (data && data.length > 0) {
                const yVals = data.map((el) => el.chance);
                const xVals = data.map((el) => el.date);
                const xRange = [
                    marginLeft + inset,
                    width - marginRight - inset,
                ];
                const yRange = [
                    height - marginBottom - inset,
                    marginTop + inset,
                ];
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
        } catch (e) {
            console.log("error generating graph", e);
        }
    }

    $: width, data, createGraph();

    function handleFocusMouse(e: any, i: number, point: any) {
        dotInfo = [point, i, e];
        if (onScrub) onScrub(points[dotInfo[1]].y);
    }
</script>

<div class="min-h-200 min-w-full block relative" bind:clientWidth={width}>
    {#if graphReady}
        <svg
            {width}
            {height}
            viewBox="0 0 {width} {height}"
            on:mouseout={() => {
                dotInfo = null;
                if (onScrub && lastDp) onScrub(lastDp.chance);
            }}
            on:blur={() => {
                dotInfo = null;
                if (onScrub && lastDp) onScrub(lastDp.chance);
            }}
        >
            <!-- Chart lines -->
            {#each lines as lineArea, i}
                <g class="chartlines" pointer-events="none">
                    {#if dotInfo}
                        <path
                            class={points[dotInfo[1]].y > 49.9
                                ? "stroke-emerald-400"
                                : "stroke-red-600"}
                            fill="none"
                            d={lineArea.line}
                            stroke-width={strokeWidth}
                            stroke-linecap={"round"}
                            stroke-linejoin={"round"}
                        />
                        <circle
                            r={5}
                            class={points[dotInfo[1]].y > 49.9
                                ? "fill-emerald-300 stroke-emerald-400"
                                : "fill-red-400 stroke-red-500"}
                            stroke-width={2}
                            cx={xScale(points[dotInfo[1]].x)}
                            cy={yScale(points[dotInfo[1]].y)}
                        />

                        <!-- Area -->
                        <path
                            d={lineArea.area}
                            class={points[dotInfo[1]].y > 49.9
                                ? "fill-emerald-300/10"
                                : "fill-red-600/10"}
                            stroke="none"
                        />
                    {:else}
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

                        <!-- Area -->
                        <path
                            d={lineArea.area}
                            class={lastDp && lastDp.chance > 49.9
                                ? "fill-emerald-300/10"
                                : "fill-red-600/10"}
                            stroke="none"
                        />
                    {/if}
                </g>
            {/each}

            <!-- Y-axis and horizontal grid lines -->
            <g
                class="y-axis"
                transform="translate({marginLeft}, 0)"
                pointer-events="none"
            >
                {#each yTicks as tick, i}
                    <g class="tick" transform="translate(0, {yScale(tick)})">
                        <line
                            class="tick-grid"
                            x1={inset}
                            x2={width - marginLeft - marginRight}
                        />
                        <text
                            x={width - marginLeft - marginRight / 2}
                            y="5"
                            class="fill-gray-600 text-[10px] font-mono"
                        >
                            {tick + yFormat}
                        </text>
                    </g>
                {/each}
            </g>

            <!-- X-axis and vertical grid lines -->
            <g
                class="x-axis overflow-hidden"
                transform="translate(0,{height - marginBottom - inset})"
                pointer-events="none"
            >
                {#if xScaledDotInfo && dotInfo}
                    <g class="tick" transform="translate({xScaledDotInfo}, 0)">
                        {#if verticalGrid}
                            <line class="tick-grid" y2={-height + 70} />
                        {/if}
                        <text
                            id="date-tooltip"
                            y={-height + 50}
                            x={xScaledDotInfo > workingWidth - 70
                                ? workingWidth - 70 - xScaledDotInfo
                                : xScaledDotInfo < 70
                                ? 70 - xScaledDotInfo
                                : undefined}
                            class="fill-gray-700 text-sm font-mono w-14"
                        >
                            {`${dateFormatter.format(
                                points[dotInfo[1]].x
                            )}`}
                        </text>
                    </g>
                {/if}
                {#each xTicks as tick, i}
                    <g class="tick" transform="translate({xScale(tick)}, 0)">
                        <line class="tick-start" stroke="black" y2="6" />
                        <text
                            y="20"
                            class="font-mono text-[10px] fill-gray-500"
                        >
                            {xTicksFormatted[i]}
                        </text>
                    </g>
                {/each}
            </g>
            {#each pointsScaled as point, i}
                <path
                    stroke="none"
                    fill-opacity="0"
                    class="voronoi-cell"
                    d={voronoiGrid.renderCell(i)}
                    on:mouseover={(e) => handleFocusMouse(e, i, point)}
                    on:focus={(e) => handleFocusMouse(e, i, point)}
                />
            {/each}
        </svg>
    {/if}
</div>

<nav class="flex justify-between">
    {#each Object.values(PriceHistoryTerm) as v}
        <button
            on:click={() => term = v}
            class={`px-4 py-1.5 rounded-md hover:bg-gray-100 text-xs ${term === v ? "text-gray-700 bg-gray-200 font-semibold" : "text-gray-600"}`}
        >
            {v}
        </button>
    {/each}
</nav>

<!-- {#if dotInfo}
    <div
        class="absolute bg-black rounded-full p-1 text-white flex justify-center items-center text-[10px] font-mono pointer-events-none shadow-md"
        style="left:{dotInfo[0].clientX}px; top:{dotInfo[2].clientY +5}px;"
    >
        {points[dotInfo[1]].y}{yFormat}
        {dotInfo[0].clientX}
    </div>
{/if} -->

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
        stroke-opacity: 0.5;
        stroke-dasharray: 4;
        color: black;
    }
    .tick text {
        text-anchor: middle;
    }
</style>
