export const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const sol = new Intl.NumberFormat("en-US", {
    notation: "compact",
    minimumFractionDigits: 1,
    maximumFractionDigits: 9,
});

export const date = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
    dateStyle: "short",
});


export function readableAddress(address: string) {
    return `${address.substring(0, 6)}...`;
}

export function relativeTime(date: Date) {
    const formatter = new Intl.RelativeTimeFormat('en-US');
    const ranges: Record<string, number> = {
        years: 3600 * 24 * 365,
        months: 3600 * 24 * 30,
        weeks: 3600 * 24 * 7,
        days: 3600 * 24,
        hours: 3600,
        minutes: 60,
        seconds: 1
    };
    type RelativeTimeFormatUnit =
        | "year" | "years"
        | "quarter" | "quarters"
        | "month" | "months"
        | "week" | "weeks"
        | "day" | "days"
        | "hour" | "hours"
        | "minute" | "minutes"
        | "second" | "seconds"
        ;
    const units: RelativeTimeFormatUnit[] = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"]; // order matters here.
    const secondsElapsed = (date.getTime() - Date.now()) / 1000;
    let i = 0;
    for (let key in ranges) {
        i++;
        if (ranges[key] < Math.abs(secondsElapsed)) {
            const delta = secondsElapsed / ranges[key];
            return formatter.format(Math.round(delta), units[i - 1]);
        }
    }
}