<script lang="ts">
    import type {
        marketPricePoint,
        pmMarketFulldata,
        pmTokenData,
    } from "@am/backend/types/market";
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

    import {
        PriceHistoryTerm,
        resamplePmPriceHistory,
    } from "$lib/components/charts/utils";
    import { format } from "$lib/utils";
    import colors from "tailwindcss/colors";
    import { api } from "$lib/api";
    import {
        PriceHistoryInterval,
        type MarketPrice,
        ClobClient,
        Chain,
    } from "$lib/clob";
    import { IconLoader, IconLoader2 } from "@tabler/icons-svelte";
    import type { TTokenData } from "$lib/types";

    export let term: PriceHistoryTerm = PriceHistoryTerm.DAY;
    export let tokenData: Record<string, TTokenData>;

    const marginTop = 10;
    const marginRight = 60;
    const marginBottom = 40;
    const marginLeft = 20;
    const inset = 0;
    const yFormat = "%";
    const strokeWidth = 2;
    const yScalefactor = 3;
    const xType = scaleUtc; // type of x-scale
    const yType = scaleLinear; // type of y-scale
    const curve = curveLinear; // method of interpolation between points

    let width = 600;
    let height = 240;

    $: workingWidth = width - inset - marginLeft - marginRight + 50;
    $: xScaledDotInfo = dotInfo ? xScale(aggPoints[dotInfo.i].x) : undefined;

    let dotInfo: {
            point: any;
            e: any;
            i: number;
            tokenPoints: Record<string, { x: Date; y: number }>;
        } | null,
        lines: Map<
            string,
            {
                area: string | null;
                line: string | null;
            }
        >,
        tokenPoints: Record<string, { x: Date; y: number }[]>,
        aggPoints: { x: Date; y: number; token: string }[],
        xDomain: Date[],
        yDomain: number[],
        xScale: ScaleTime<number, number, never>,
        yScale: ScaleLinear<number, number, never>,
        tokenPointsScaled: ArrayLike<any>[],
        aggPointsScaled: ArrayLike<any>,
        voronoiGrid: Voronoi<Delaunay.Point>,
        xTicks: Date[],
        xTicksFormatted: string[],
        yTicks: number[],
        graphReady: boolean = false;

    async function createGraph() {
        try {
            if (!tokenData) return;

            lines = new Map();
            tokenPoints = {};
            tokenPointsScaled = [];
            let i = 0;

            let xVals: Date[] = Object.values(tokenData)
                .reduce((acc: Date[], val) => {
                    return [...acc, ...val.data.map((e: any) => e.date)];
                }, [])
                .sort(
                    (a: Date, b: Date) =>
                        (a as unknown as number) - (b as unknown as number)
                );

            const xRange = [marginLeft + inset, width - marginRight - inset];
            const yRange = [height - marginBottom - inset, marginTop + inset];
            const xScalefactor = width / 100; //y-axis number of values

            yDomain = [0, 100];
            xDomain = [xVals[0], xVals[xVals.length - 1]];

            xScale = xType(xDomain, xRange);
            yScale = yType(yDomain, yRange);

            for (const [id, value] of Object.entries(tokenData)) {
                const { data } = value;
                if (data.length === 0) return;

                const _yVals = data.map((el) => el.price);
                const _xVals = data.map((el) => el.date);

                const gaps = (d: any, i: any) =>
                    _xVals[i] instanceof Date && !isNaN(_yVals[i]);

                const points = data.map((el) => ({
                    x: el.date,
                    y: el.price,
                }));

                const cleanData = points.map(gaps);
                const chartLine = line()
                    .defined((i: any) => cleanData[i])
                    .curve(curve)
                    .x((i: any) => xScale(_xVals[i]))
                    .y((i: any) => yScale(_yVals[i]));

                const chartArea = area()
                    .defined((i: any) => cleanData[i])
                    .curve(curve)
                    .x((i: any) => xScale(_xVals[i]))
                    .y0(yScale(0))
                    .y1((i: any) => yScale(_yVals[i]));

                const I: any[] = range(_xVals.length);
                const newLine = chartLine(I);
                const newArea = chartArea(I);
                lines.set(id, { line: newLine, area: newArea });

                const pointsScaled: ArrayLike<any> = points.map((el) => [
                    xScale(el.x),
                    yScale(el.y),
                ]);

                tokenPointsScaled.push(pointsScaled);
                tokenPoints[id] = points;

                i++;
            }

            const niceY = scaleLinear().domain(yDomain).nice();
            yTicks = niceY.ticks(yScalefactor);

            xTicks = xScale.ticks(xScalefactor);
            xTicksFormatted = xTicks.map(
                (el) => `${el.getUTCMonth() + 1}/${el.getDate()}`
            );

            aggPoints = Object.entries(tokenPoints).reduce(
                (acc: { token: string; x: Date; y: number }[], val) => {
                    acc = [
                        ...acc,
                        ...val[1].map((t) => ({ ...t, token: val[0] })),
                    ];
                    return acc;
                },
                []
            );

            aggPointsScaled = aggPoints.map((el) => [
                xScale(el.x),
                yScale(el.y),
            ]);

            const delaunayGrid = Delaunay.from(aggPointsScaled);
            voronoiGrid = delaunayGrid.voronoi([0, 0, width, height]);

            graphReady = true;
        } catch (e) {
            console.log("error generating graph", e);
        }
    }

    $: width, tokenData, createGraph();

    function handleFocusMouse(e: any, i: number, point: any) {
        const aggX = aggPoints[i].x;
        const relAggPoints = aggPoints
            .filter((p) => p.x.getTime() === aggX.getTime())
            .reduce((acc: Record<string, { x: Date; y: number }>, val) => {
                if (!acc[val.token]) {
                    acc[val.token] = { y: val.y, x: val.x };
                }
                return acc;
            }, {});
        dotInfo = { point, e, i, tokenPoints: relAggPoints };
    }
</script>

<div class="min-w-full h-full block relative" bind:clientWidth={width}>
    <div class="flex items-center overflow-hidden p-3 h-14 gap-1">
        {#each Object.entries(tokenData) as token}
            <button
                class="text-xs flex items-center font-medium h-7 gap-2 min-w-[5rem] py-0.5 pl-2.5 pr-2.5 rounded-lg dark:text-neutral-200 dark:bg-neutral-900/70 dark:border-0 text-neutral-800 bg-white border border-neutral-200"
            >
                <div
                    class={`h-1.5 w-1.5 rounded-full`}
                    style={`background-color: ${token[1].color};`}
                />
                {token[1].outcome}
                {(dotInfo?.tokenPoints[token[0]].y.toFixed(0) ??
                    tokenPoints[token[0]][
                        tokenPoints[token[0]].length - 1
                    ].y.toFixed(0) ??
                    "--") + "¢"}
            </button>
        {/each}
        <nav
            class="hidden lg:flex justify-end ml-auto gap-1 rounded-lg px-1.5 bg-white dark:bg-neutral-900/50 border dark:border-0 border-neutral-200"
        >
            {#each Object.values(PriceHistoryTerm) as v}
                <button
                    on:click={() => (term = v)}
                    class={`h-8 w-7 text-xs font-semibold ${
                        term === v
                            ? "dark:text-white text-black"
                            : "dark:text-neutral-500 text-neutral-400"
                    }`}
                >
                    {v}
                </button>
            {/each}
        </nav>
    </div>
    {#if graphReady && tokenData}
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
                            class="dark:stroke-neutral-800 stroke-neutral-400"
                            stroke-dasharray="3"
                            x1={inset}
                            x2={width - marginLeft - marginRight}
                        />
                        <text
                            x={width - marginLeft - marginRight / 2}
                            y="5"
                            class="fill-neutral-600 dark:fill-neutral-500 text-xs"
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
                        <line
                            class="stroke-neutral-400 dark:stroke-neutral-800"
                            stroke-width="1"
                            y2="6"
                        />
                        <text
                            y="25"
                            class="fill-neutral-600 dark:fill-neutral-500 text-xs"
                        >
                            {xTicksFormatted[i]}
                        </text>
                    </g>
                {/each}
                {#if xScaledDotInfo && dotInfo}
                    <g class="tick" transform="translate({xScaledDotInfo}, 0)">
                        <line
                            y2={-height + 70}
                            class="dark:stroke-neutral-800 stroke-neutral-300"
                        />
                        <rect
                            height={20}
                            width={120}
                            y={11}
                            rx={10}
                            class="dark:fill-white fill-neutral-700"
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
                            class="dark:fill-black fill-white font-semibold text-xs w-14"
                        >
                            {`${format.date.format(aggPoints[dotInfo.i].x)}`}
                        </text>
                    </g>
                {/if}
            </g>

            {#each aggPointsScaled as point, i}
                <path
                    fill-opacity="0"
                    d={voronoiGrid.renderCell(i)}
                    on:mouseover={(e) => handleFocusMouse(e, i, point)}
                    on:focus={(e) => handleFocusMouse(e, i, point)}
                />
            {/each}

            <!-- Chart lines -->
            {#each Array.from(lines.entries()) as [id, lineArea], i}
                <g class="chartlines" pointer-events="none">
                    {#if dotInfo}
                        <path
                            stroke={tokenData[id].color}
                            fill="none"
                            d={lineArea.line}
                            stroke-width={strokeWidth}
                            stroke-linecap={"round"}
                            stroke-linejoin={"round"}
                        />
                        {#if dotInfo.tokenPoints[id]}
                            <circle
                                r={6}
                                class={"stroke-neutral-50 dark:stroke-neutral-950"}
                                fill={tokenData[id]?.color}
                                stroke-width={3}
                                cx={xScale(dotInfo.tokenPoints[id].x)}
                                cy={yScale(dotInfo.tokenPoints[id].y)}
                            />
                        {/if}
                    {:else}
                        <path
                            fill="none"
                            stroke={tokenData[id].color}
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
