let index = 0;

/** Get an incrementing id to use as a dice id */
export function generateDiceId() {
  index++;
  return `${index}`;
}
