/** Generate a random number in range `min` to `max` */
export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
