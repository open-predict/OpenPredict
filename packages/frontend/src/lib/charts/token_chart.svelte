<script lang="ts">
    import type {
        marketPricePoint,
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

    import { PriceHistoryTerm, resamplePmPriceHistory } from "$lib/charts/utils";
    import { dateFormatter } from "$lib/utils";
    import type { pmTokenOrderdata } from "@am/backend/types/market";
    import colors from "tailwindcss/colors";

    export let tokenMetadata: pmTokenData[] = [];
    export let pmTokenOrderdata: Map<string, pmTokenOrderdata> | undefined =
        undefined;
    export let term: PriceHistoryTerm = PriceHistoryTerm.ALL;

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
    let height = 204;

    const acceptableColors = [
        "indigo",
        "sky",
        "blue",
        "orange",
        "yellow",
    ];

    $: workingWidth = width - inset - marginLeft - marginRight + 50;
    $: tokens = tokenMetadata
        ? tokenMetadata
              .map((t, i) => ({
                  ...t,
                  color:
                      t.outcome === "Yes"
                          ? colors.green[400]
                          : t.outcome === "No"
                          ? colors.red[400]
                          : Object.entries(colors).filter(([name, value]) =>
                                acceptableColors.includes(name)
                            )[i][1]["500"],
              }))
              .reduce(
                  (
                      acc: Record<string, pmTokenData & { color: string }>,
                      val
                  ) => {
                      acc[val.token_id] = val;
                      return acc;
                  },
                  {}
              )
        : undefined;

    $: tokenData = pmTokenOrderdata
        ? Array.from(pmTokenOrderdata.entries())
              .map((e, i) => {
                  return {
                      id: e[0],
                      data: resamplePmPriceHistory(e[1].priceHistory, term),
                  };
              })
              .reduce(
                  (
                      acc: Record<
                          string,
                          {
                              id: string;
                              data: {
                                  date: Date;
                                  price: number;
                              }[];
                          }
                      >,
                      val
                  ) => {
                      acc[val.id] = val;
                      return acc;
                  },
                  {}
              )
        : undefined;

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

    function createGraph() {
        try {
            if (!tokenData) return;

            lines = new Map();
            tokenPoints = {};
            tokenPointsScaled = [];
            let i = 0;

            let xVals: Date[] = Object.values(tokenData)
                .reduce((acc: Date[], val) => {
                    return [...acc, ...val.data.map((e) => e.date)];
                }, [])
                .sort(
                    (a, b) =>
                        (a as unknown as number) - (b as unknown as number)
                );

            const xRange = [marginLeft + inset, width - marginRight - inset];
            const yRange = [height - marginBottom - inset, marginTop + inset];
            const xScalefactor = width / 100; //y-axis number of values

            yDomain = [0, 100];
            xDomain = [xVals[0], xVals[xVals.length - 1]];

            xScale = xType(xDomain, xRange);
            yScale = yType(yDomain, yRange);

            for (const { id, data } of Object.values(tokenData)) {
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

<div
    class="min-h-200 min-w-full block relative"
    bind:clientWidth={width}
>
    <div class="flex items-center overflow-hidden p-3 h-14 gap-1">
        {#if tokens}
            {#each Object.entries(tokens) as token}
                <button
                    class="text-xs flex items-center font-medium h-7 gap-2 min-w-[5rem] bg-neutral-900/70 py-0.5 pl-2.5 pr-2.5 text-neutral-200 ring-neutral-800 rounded-md"
                >
                    <div class={`h-1.5 w-1.5 rounded-full`} style={`background-color: ${token[1].color};`} />
                    {token[1].outcome}
                    {(dotInfo?.tokenPoints[token[0]].y ?? tokenPoints[token[0]][tokenPoints[token[0]].length - 1].y ?? "--") + "¢"}
                </button>
            {/each}
        {/if}
        <nav
            class="flex justify-end ml-auto gap-1 bg-neutral-900/50 rounded-lg px-1.5"
        >
            {#each Object.values(PriceHistoryTerm) as v}
                <button
                    on:click={() => (term = v)}
                    class={`h-8 w-7 text-xs font-semibold ${
                        term === v ? "text-white" : "text-neutral-500"
                    }`}
                >
                    {v}
                </button>
            {/each}
        </nav>
    </div>
    {#if graphReady && tokens}
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
                        <line y2={-height + 70} class="stroke-neutral-800" />
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
                            {`${dateFormatter.format(aggPoints[dotInfo.i].x)}`}
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
                            stroke={tokens[id]?.color}
                            fill="none"
                            d={lineArea.line}
                            stroke-width={strokeWidth}
                            stroke-linecap={"round"}
                            stroke-linejoin={"round"}
                        />
                        {#if dotInfo.tokenPoints[id]}
                            <circle
                                r={6}
                                class={"stroke-neutral-950"}
                                fill={tokens[id]?.color}
                                stroke-width={5}
                                cx={xScale(dotInfo.tokenPoints[id].x)}
                                cy={yScale(dotInfo.tokenPoints[id].y)}
                            />
                        {/if}
                    {:else}
                        <path
                            fill="none"
                            stroke={tokens[id]?.color}
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
