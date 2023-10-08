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

    import { PriceHistoryTerm, resamplePmPriceHistory } from "./utils";
    import { dateFormatter } from "$lib/utils";
    import type { pmTokenOrderdata } from "$lib/types";

    export let pmTokenOrderdata: Map<string, pmTokenOrderdata> | undefined =
        undefined;
    export let term: PriceHistoryTerm = PriceHistoryTerm.ALL;

    const marginTop = 30;
    const marginRight = 60;
    const marginBottom = 40;
    const marginLeft = 20;
    const inset = 0;
    const yFormat = "%";
    const strokeWidth = 2;
    const verticalGrid = true;
    const yScalefactor = 3;
    const xType = scaleUtc; // type of x-scale
    const yType = scaleLinear; // type of y-scale
    const curve = curveLinear; // method of interpolation between points

    let width = 600;
    let height = 300;

    $: workingWidth = width - inset - marginLeft - marginRight + 50;
    $: tokenData = pmTokenOrderdata
        ? Array.from(pmTokenOrderdata.entries()).map((e) => ({
              id: e[0],
              data: resamplePmPriceHistory(e[1].priceHistory, term),
          }))
        : undefined;
    $: xScaledDotInfo = dotInfo ? xScale(points[0][dotInfo[1]].x) : undefined;

    let dotInfo: [number, number, any] | null,
        lines: {
            area: string | null;
            line: string | null;
        }[],
        points: { x: Date; y: number }[][] = [],
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
            if (!tokenData) return;
            lines = [];
            points = [];
            let i = 0;
            for (const { id, data } of tokenData) {
                if (data.length === 0) return;
                const yVals = data.map((el) => el.price);
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

                points.push(
                    data.map((el) => ({
                        x: el.date,
                        y: el.price,
                    }))
                );

                const cleanData = points[i].map(gaps);
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
                lines.push({ line: newLine, area: newArea });

                pointsScaled = points[i].map((el) => [
                    xScale(el.x),
                    yScale(el.y),
                ]);
                const delaunayGrid = Delaunay.from(pointsScaled);
                voronoiGrid = delaunayGrid.voronoi([0, 0, width, height]);

                xTicks = xScale.ticks(xScalefactor);

                xTicksFormatted = xTicks.map(
                    (el) => `${el.getUTCMonth() + 1}/${el.getDate()}`
                );

                yTicks = niceY.ticks(yScalefactor);

                i++;
            }
            graphReady = true;
        } catch (e) {
            console.log("error generating graph", e);
        }
    }

    $: width, tokenData, createGraph();

    function handleFocusMouse(e: any, i: number, point: any) {
        dotInfo = [point, i, e];
        // if (onScrub) onScrub(points[dotInfo[1]].y);
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
            }}
            on:blur={() => {
                dotInfo = null;
            }}
        >
            <!-- Y-axis and horizontal grid lines -->
            <g
                class="y-axis"
                transform="translate({marginLeft}, 0)"
                pointer-events="none"
            >
                {#each yTicks as tick, i}
                    <g class="tick" transform="translate(0, {yScale(tick)})">
                        <line
                            class="stroke-neutral-800"
                            stroke-dasharray="3"
                            x1={inset}
                            x2={width - marginLeft - marginRight}
                        />
                        <text
                            x={width - marginLeft - marginRight / 2}
                            y="5"
                            class="fill-neutral-500 text-xs"
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
                {#each xTicks as tick, i}
                    <g class="tick" transform="translate({xScale(tick)}, 0)">
                        <line class="tick-start" stroke="black" y2="6" />
                        <text y="25" class="text-xs fill-neutral-500">
                            {xTicksFormatted[i]}
                        </text>
                    </g>
                {/each}
                {#if xScaledDotInfo && dotInfo}
                    <g class="tick" transform="translate({xScaledDotInfo}, 0)">
                        <!-- {#if verticalGrid} -->
                        <line y2={-height + 80} class="stroke-neutral-800" />
                        <!-- {/if} -->
                        <rect
                            height={20}
                            width={120}
                            y={11}
                            rx={10}
                            class="fill-white"
                            x={xScaledDotInfo > workingWidth - 70
                                ? workingWidth - 130 - xScaledDotInfo
                                : xScaledDotInfo < 70
                                ? 10 - xScaledDotInfo
                                : -60}
                        />
                        <text
                            id="date-tooltip"
                            y={25}
                            width={120}
                            x={xScaledDotInfo > workingWidth - 70
                                ? workingWidth - 70 - xScaledDotInfo
                                : xScaledDotInfo < 70
                                ? 70 - xScaledDotInfo
                                : undefined}
                            class="fill-black font-semibold text-xs w-14"
                        >
                            {`${dateFormatter.format(points[0][dotInfo[1]].x)}`}
                        </text>
                    </g>
                {/if}
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

            <!-- Chart lines -->
            {#each lines as lineArea, i}
                <g class="chartlines" pointer-events="none">
                    {#if dotInfo}
                        <path
                            class={points[i][dotInfo[1]].y > 49.9
                                ? "stroke-emerald-400"
                                : "stroke-red-600"}
                            fill="none"
                            d={lineArea.line}
                            stroke-width={strokeWidth}
                            stroke-linecap={"round"}
                            stroke-linejoin={"round"}
                        />
                        <circle
                            r={6}
                            class={points[i][dotInfo[1]].y > 49.9
                                ? "fill-emerald-400 stroke-neutral-950"
                                : "fill-red-600 stroke-neutral-950"}
                            stroke-width={5}
                            cx={xScale(points[i][dotInfo[1]].x)}
                            cy={yScale(points[i][dotInfo[1]].y)}
                        />
                    {:else}
                        <path
                            class={"stroke-indigo-400"}
                            fill="none"
                            d={lineArea.line}
                            stroke-opacity={1}
                            stroke-width={strokeWidth}
                            stroke-linecap={"round"}
                            stroke-linejoin={"round"}
                        />
                    {/if}
                </g>
            {/each}
        </svg>
    {/if}
    <div
        class="flex items-center gap-2 border-t border-neutral-900 overflow-hidden px-2"
    >
        {#if pmTokenOrderdata}
            {#each Array.from(pmTokenOrderdata.keys()) as token_id}
                <button
                    class="text-xs flex items-center gap-2 py-1 px-2.5 ring-1 text-neutral-200 ring-neutral-800 bg-transparent rounded-xl"
                >
                    <div class="h-2 w-2 rounded-full bg-indigo-800" />
                    {token_id.slice(0, 5)}
                </button>
            {/each}
        {/if}
        <nav class="flex justify-end ml-auto gap-3">
            {#each Object.values(PriceHistoryTerm) as v}
                <button
                    on:click={() => (term = v)}
                    class={`h-10 px-2 text-xs border-b font-semibold ${
                        term === v
                            ? "text-white border-neutral-200"
                            : "text-neutral-400 border-transparent"
                    }`}
                >
                    {v}
                </button>
            {/each}
        </nav>
    </div>
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
    .tick text {
        text-anchor: middle;
    }
</style>
