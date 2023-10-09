import { createAvatar } from '@dicebear/core';
import * as shapes from '@dicebear/shapes';

export enum Errors {
  LOGGED_OUT = "LOGGED_OUT",
  NO_CONNECTION = "NO_CONNECTION",
  INSUFFICENT_SOL = "INSUFFICENT_SOL",
  INSUFFICENT_USDC = "INSUFFICENT_USDC",
  UNABLE_TO_SWAP = "UNABLE_TO_SWAP",
  NO_WALLET = "NO_WALLET",
  TRANSACTION_FAILED = "TRANSACTION_FAILED",
  CHECK_CONSOLE = "CHECK_CONSOLE"
}

export enum TxStatus {
  SIGNING = "SIGNING",
  SENDING = "SENDING",
  SWAPPING = "SWAPPING",
  CONFIRMING = "CONFIRMING",
  COMPLETE = "COMPLETE"
}

export type TLinkDef = { href: string, name: string, Icon: any }

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const solFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 9,
});

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
  dateStyle: "short",
});

export function autoresizeTextarea(node: any) {
  const handleInput = (e: Event) => {
    node.style.height = "0"
    node.style.height = node.scrollHeight + "px";
  };
  document.addEventListener("input", handleInput, false);
  document.addEventListener("focus", handleInput, false);
  return {
    destroy() {
      document.removeEventListener("click", handleInput, false);
      document.removeEventListener("focus", handleInput, false);
    },
  };
}

export function getScrollParent(node: HTMLElement | null) {
  if (node === null) {
    return null;
  }
  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentElement);
  }
}

export function generateProfileImage(publicKey: string) {
  const full = ["ellipse", "ellipseFilled", "line", "polygon", "polygonFilled", "rectangle", "rectangleFilled"];
  const shapeColors = ["0284c7", "4f46e5", "4338ca"]
  return createAvatar(shapes, {
    seed: publicKey,
    backgroundType: ["gradientLinear"],
    backgroundColor: ["c4b5fd", "7dd3fc", "67e8f9"],
    shape1Color: shapeColors,
    shape2Color: shapeColors,
    shape3Color: shapeColors,
    shape1: ["ellipse", "line"],
    shape2: ["ellipse", "line"],
    shape3: ["ellipse", "line"]
  }).toDataUriSync();
}

export function readableAddress(address: string) {
  return `${address.substring(0, 4)}...${address.slice(-4)}`;
}

export function timeAgo(date: Date) {
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