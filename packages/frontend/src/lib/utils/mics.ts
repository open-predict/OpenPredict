import { browser } from '$app/environment';
import type { TMarket, TUserMinimal } from '$lib/types';
import type { AppRouterOutputs } from '@am/backend/server/routers/_app';
import type { marketFulldata } from '@am/backend/types/market';
import type { TUser } from '@am/backend/types/user';
import { createAvatar } from '@dicebear/core';
import * as shapes from '@dicebear/shapes';
import { PublicKey } from '@solana/web3.js';
import colors from 'tailwindcss/colors';

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

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

export const fromPmUser = (
  id: string,
  u: { name: string; profileImage: string } | undefined
): TUserMinimal => {
  return {
    image: u?.profileImage
      ? u.profileImage
      : generateProfileImage(id),
    name: u?.name,
    id,
  };
};

export const fromOpUser = (
  id: string,
  u: TUser | undefined
): TUserMinimal => {
  return {
    image: u?.metadata?.image ?? generateProfileImage(id),
    id,
    name: u?.metadata?.name,
  };
};

export const darkThemed = () => {
  let darkTheme = false;
  if (browser) {
    const { theme } = JSON.parse(decodeURI(document.cookie
      .split("; ")
      .find((row) => row.startsWith("ui_store="))
      ?.split("=")[1] ?? "") ?? "{}");
    if (theme === "dark" || window.matchMedia("(prefers-color-scheme: dark)").matches) {
      darkTheme = true;
    }
  }
  return darkTheme;
}

export function marketsFromSearch(searchResults: AppRouterOutputs['searchMarkets']): TMarket[] {
  let _markets: TMarket[] = [];
  searchResults.data.forEach(({ opMarket, pmMarket }) => {
    if (opMarket) {
      const id = new PublicKey(
        opMarket.data.data.AmmAddress
      ).toBase58();
      _markets.push({
        opMarket: {
          ...opMarket,
          likeNo: searchResults?.meta.likeNo[id] ?? 0,
          commentNo: searchResults?.meta.likeNo[id] ?? 0,
        },
        pmMarket: undefined,
      });
    }
    if (pmMarket) {
      _markets.push({
        pmMarket: {
          ...pmMarket,
          likeNo:
            searchResults?.meta.likeNo[
            pmMarket.data.condition_id
            ] ?? 0,
          commentNo:
            searchResults?.meta.likeNo[
            pmMarket.data.condition_id
            ] ?? 0,
        },
        opMarket: undefined,
      });
    }
  });
  return _markets;
}

// export const tokenStyle = (v: string) => {
//   const acceptableColors = [colors.cyan, colors.fuchsia, colors.indigo, colors.orange, colors.sky, colors.yellow];
//   const outcome = v.toLowerCase().replaceAll(" ", "");
//   const dark = isDarkTheme()
//   if (outcome === "yes") {
//     return colors.green[500]
//   } else if (outcome === "no") {
//     return colors.red[500]
//   } else {
//     const index = outcome
//     .split('')
//     .map((char) => char.charCodeAt(0))
//     .reduce((a, b) => a + b, 0) % acceptableColors.length;
//     return acceptableColors[index][500]
//   }
// }