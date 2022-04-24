import Color from "color";
import convert from "color-convert";

export type DefaultColor =
  | "root block"
  | "block color 1"
  | "block color 2"
  | "block color 3"
  | "box"
  | "player";

export type HslColor = [number, number, number] | DefaultColor;

export function toHslArr(color: HslColor): [number, number, number] {
  if (typeof color === "string") {
    switch (color) {
      case "root block":
        return [0, 0, 90];
      case "block color 1":
        return [216, 100, 60];
      case "block color 2":
        return [144, 100, 60];
      case "block color 3":
        return [198, 100, 60];
      case "box":
        return [36, 100, 60];
      case "player":
        return [324, 100, 40];
      default:
        throw new RangeError("unknown color name: ", color);
    }
  }
  return color as [number, number, number];
}

export function toHslStr(color: HslColor): string {
  let [h, s, l] = toHslArr(color);
  return `hsl(${h},${s}%,${l}%)`;
}

export function toColorObj(color: HslColor): Color {
  return Color.hsl(toHslArr(color));
}

export function toRawLevelColor(color: HslColor): {
  hue: number;
  sat: number;
  val: number;
} {
  let [h, s, l] = toHslArr(color);
  let [hue, sat, val] = convert.hsl.hsv([h, s, l]);
  hue /= 360;
  sat /= 100;
  val /= 100;
  return { hue, sat, val };
}

const hueMap: { [k: number]: DefaultColor } = {
  0.6: "block color 1",
  0.4: "block color 2",
  0.55: "block color 3",
  0.1: "box",
  0.9: "player",
};

export function fromRawColor(
  color: {
    hue: number;
    sat: number;
    val: number;
  },
  disablePalette = false
): HslColor {
  let { hue, sat, val } = color;

  if (disablePalette) return convert.hsv.hsl([hue * 360, sat * 100, val * 100]);

  if (sat === 0) return "root block";

  let name = hueMap[hue];
  if (name !== undefined) {
    return name;
  }

  return convert.hsv.hsl([hue * 360, sat * 100, val * 100]);
}
