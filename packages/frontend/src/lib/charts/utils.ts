import log from "$lib/log";
import { USDC_PER_DOLLAR, getChance } from "$lib/utils/op";
import type { marketPricePoint } from "@am/backend/types/market";
import moment from "moment";
import type { MarketPrice } from "$lib/clob";

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
	if (diffDays > 14) return "day"
	if (diffDays > 1) return "hour"
	return "minute"
}

type TPeriod = "minute" | "hour" | "day" | "week";

export function resampleOpMarketPricePoints(rawData: marketPricePoint[], term: PriceHistoryTerm) {

	log("debug", "utils-resample", "resampleOpMarketPricePoints...")

	let data = [...rawData];

	let start = new Date();
	let end = new Date();
	let period: TPeriod = "minute";

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
			start = data.length > 0 ? data[0].At : new Date(Date.now() - (24 * 60 * 60 * 1000));
			period = getIdealPeriod(start, end)
			break;
		default:
			start = new Date(Date.now() - (24 * 60 * 60 * 1000));
			period = "minute";
			break;
	}

	// fill start & end date
	const firstDp: marketPricePoint =
		data.length > 0
			? { ...data[0], At: start }
			: {
				At: start,
				Yes: BigInt(0),
				No: BigInt(0),
				Subsidy: BigInt(0),
			};
	const lastDp: marketPricePoint =
		data.length > 0
			? { ...data[data.length - 1], At: end }
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
	let datesResampled = samples.map(value => {
		let resampled = moment(value.date).startOf(period)
		return { date: resampled, chance: value.chance, subsidy: value.subsidy }
	})
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

	let filled: DPWithMoment[] = []
	while (startTime.isBefore(endTime)) {
		if (datesReduced[startTime.valueOf()]) {
			filled.push(datesReduced[startTime.valueOf()])
		} else {
			filled.push({ date: moment(startTime), chance: filled.length > 0 ? filled[filled.length - 1].chance : 0.5, subsidy: 0 })
		}
		startTime.add(1, period)
	}

	return filled.map(dp => ({ ...dp, date: dp.date.toDate() }));
}

export function resamplePmPriceHistory(rawData: MarketPrice[], term: PriceHistoryTerm) {

	log("debug", "utils-resample", "resamplePmPriceHistory...")

	let data = [...rawData];

	let start = new Date();
	let end = new Date();
	let period: TPeriod = "minute";

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
			start = data.length > 0 ? new Date(data[0].t) : new Date(Date.now() - (24 * 60 * 60 * 1000));
			period = getIdealPeriod(start, end)
			break;
		default:
			start = new Date(Date.now() - (24 * 60 * 60 * 1000));
			period = "minute";
			break;
	}

	// fill start & end date
	const firstDp: MarketPrice =
		data.length > 0
			? { ...data[0], t: start.getTime() }
			: {
				t: start.getTime(),
				p: 0
			};
	const lastDp: MarketPrice =
		data.length > 0
			? { ...data[data.length - 1], t: end.getTime() }
			: {
				t: end.getTime(),
				p: 0
			};

	data.unshift(firstDp);
	data.push(lastDp);

	let startTime = moment(start).startOf(period)
	let endTime = moment(end)
	let datesResampled = data.map(value => {
		let resampled = moment(value.t).startOf(period)
		return { date: resampled, price: value.p * 100 }
	})

	type DPWithMoment = {
		date: moment.Moment;
		price: number;
	}

	// create a map object with time key for lookup
	let datesReduced = datesResampled.reduce((result: Record<number, DPWithMoment>, value, key) => {
		result[value.date.valueOf()] = value
		return result
	}, {})

	let filled: DPWithMoment[] = []
	while (startTime.isBefore(endTime)) {
		if (datesReduced[startTime.valueOf()]) {
			filled.push(datesReduced[startTime.valueOf()])
		} else {
			filled.push({ date: moment(startTime), price: filled.length > 0 ? filled[filled.length - 1].price : 0 })
		}
		startTime.add(1, period)
	}

	return filled.map(dp => ({ ...dp, date: dp.date.toDate() }));
}
