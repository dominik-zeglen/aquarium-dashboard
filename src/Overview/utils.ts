export function getPixelColorHex(diet: string[]): number {
  let pixel = 0x0;

  if (diet.includes("herbivore")) {
    pixel |= 0x00aa00;
  }
  if (diet.includes("funghi")) {
    pixel |= 0x0000aa;
  }

  return pixel;
}
export function getColorFromHex(hex: number): string {
  let colorStr = hex.toString(16);
  if (colorStr.length < 6) {
    colorStr =
      Array(6 - colorStr.length)
        .fill(0)
        .reduce((acc, v) => acc + v, "") + colorStr;
  }

  return "#" + colorStr;
}

export function getDistanceInDimension(a: number, b: number): number {
  return (a - b) * (a - b);
}

export function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.moveTo(x - 2, y - 2);
  ctx.lineTo(x + 2, y + 2);
  ctx.moveTo(x - 2, y + 2);
  ctx.lineTo(x + 2, y - 2);
  ctx.stroke();
}
