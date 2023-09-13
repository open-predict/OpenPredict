import log from "$lib/log";
import {USDC_PER_DOLLAR, getChance} from "$lib/utils";
import type {marketPricePoint} from "@am/backend/types/market";
import moment from "moment";

export const HOUR = 1000 * 60 * 60;
export const DAY = 1000 * 60 * 60 * 24;

export enum PriceHistoryTerm {
	DAY = "1D",
	WEEK = "1W",
	MONTH = "1M",
	THREEMONTH = "3M",
	YEAR = "1Y",
	ALL = "ALL",
}

export type TMarketDataPoint = {
	date: Date;
	chance: number;
	subsidy: number;
};

export type TMarketData = TMarketDataPoint[];

export function getIdealPeriod(start: Date, end: Date): TPeriod {
	const diffDays = Math.round(Math.abs(((start as unknown as number) - (end as unknown as number)) / (24 * 60 * 60 * 1000)));
	if (diffDays > 365) return "week"
	if (diffDays > 15) return "day"
	if (diffDays > 1) return "hour"
	return "minute"
}


type TPeriod = "minute" | "hour" | "day" | "week";

export function resample(rawData: marketPricePoint[], term: PriceHistoryTerm) {

	log("debug", "utils-resample", "resampling...")

	let data = [...rawData];

	let start = new Date();
	let end = new Date();
	let period: TPeriod = "day";

	switch (term) {
		case PriceHistoryTerm.DAY:
			start = new Date(Date.now() - (24 * 60 * 60 * 1000));
			period = "minute";
			break;
		case PriceHistoryTerm.WEEK:
			start = new Date(Date.now() - 7 * (24 * 60 * 60 * 1000));
			period = "hour";
			break;
		case PriceHistoryTerm.MONTH:
			start = new Date(Date.now() - 30 * (24 * 60 * 60 * 1000));
			console.log("MONTH TERM SELECTED", start)
			period = "day";
			break;
		case PriceHistoryTerm.THREEMONTH:
			start = new Date(Date.now() - 90 * (24 * 60 * 60 * 1000));
			period = "day";
			break;
		case PriceHistoryTerm.YEAR:
			start = new Date(Date.now() - 365 * (24 * 60 * 60 * 1000));
			period = "week";
			break;
		case PriceHistoryTerm.ALL:
			start = data.length > 0 ? new Date(data[0].At) : new Date(Date.now() - (24 * 60 * 60 * 1000));
			getIdealPeriod(start, end)
			break;
		default:
			start = new Date(Date.now() - (24 * 60 * 60 * 1000));
			period = "day";
			break;
	}

	period = 'day';

	// fill start & end date
	const firstDp: marketPricePoint =
		data.length > 0
			? {...data[0], At: start}
			: {
				At: start,
				Yes: BigInt(0),
				No: BigInt(0),
				Subsidy: BigInt(0),
			};
	const lastDp: marketPricePoint =
		data.length > 0
			? {...data[data.length - 1], At: end}
			: {
				At: end,
				Yes: BigInt(0),
				No: BigInt(0),
				Subsidy: BigInt(0),
			};

	data.unshift(firstDp);
	data.push(lastDp);

	// format the rawData data
	const samples: TMarketData = data.map((dp, i) => {
		return {
			date: dp.At,
			chance: getChance(dp.Yes, dp.No) * 100,
			subsidy: Number(dp.Subsidy / BigInt(USDC_PER_DOLLAR)),
		};
	});

	let startTime = moment(start).startOf(period)
	let endTime = moment(end)

	// console.log('samples-->')
	// samples.forEach((value, key) => {
	//     console.log('[', key, '] ', moment(value.date).format("YY-MM-DD hh:mm:ss"), value.chance)
	// })

	let datesResampled = samples.map(value => {
		let resampled = moment(value.date).startOf(period)
		return {date: resampled, chance: value.chance, subsidy: value.subsidy}
	})

	// console.log('datesResampled-->')
	// datesResampled.forEach((value, key) => {
	//     console.log('[', key, '] ', value.date.format("YY-MM-DD hh:mm:ss"), value.chance)
	// })

	type DPWithMoment = {
		date: moment.Moment;
		chance: number;
		subsidy: number;
	}
	// create a map object with time key for lookup
	let datesReduced = datesResampled.reduce((result: Record<number, DPWithMoment>, value, key) => {
		result[value.date.valueOf()] = value
		return result
	}, {})

	// console.log('datesReduced-->', datesReduced)
	// for (const [key, value] of Object.entries(datesReduced)) {
	//     console.log('[', key, '] ', value.date.format("YY-MM-DD hh:mm:ss"), value.chance)
	// }

	// console.log("startTime.isBefore(endTime)", startTime.isBefore(endTime))
	let filled: DPWithMoment[] = []
	while (startTime.isBefore(endTime)) {
		if (datesReduced[startTime.valueOf()]) {
			filled.push(datesReduced[startTime.valueOf()])
		} else {
			filled.push({date: moment(startTime), chance: filled.length > 0 ? filled[filled.length - 1].chance : 0.5, subsidy: 0})
		}
		startTime.add(1, period)
	}

	// console.log('filled-->', filled)
	return filled.map(dp => ({...dp, date: dp.date.toDate()}));
	// filled.forEach((value, key) => {
	//     console.log('[', key, '] ', value.date.format("YY-MM-DD hh:mm:ss"), value.chance ? "EXISTS: " + value.chance : value.chance)
	// })
}
