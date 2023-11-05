import { createAvatar } from '@dicebear/core';
import * as shapes from '@dicebear/shapes';

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