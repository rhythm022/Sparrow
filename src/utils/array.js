import { round } from './helper';

const e10 = Math.sqrt(50); // 7.07
const e5 = Math.sqrt(10); // 3.16
const e2 = Math.sqrt(2); // 1.41

// @see https://github.com/d3/d3-array/blob/main/src/ticks.js#L46
export function tickStep(min, max, count) {
  const step0 = Math.abs(max - min) / Math.max(0, count);// step0 是用朴素方法求出来的 step
  let step1 = 10 ** Math.floor(Math.log(step0) / Math.LN10);// 找到第一个满足 10^x 形式的小于 step0 的最接近数
  const error = step0 / step1;
  if (error >= e10) step1 *= 10; //    when 7.07 ~ 9.99
  else if (error >= e5) step1 *= 5; // when 3.16 ~ 7.07
  else if (error >= e2) step1 *= 2; // when 1.41 ~ 3.16
  return step1;
}

/*
  比如 min 是 0.4 ,step 是 0.5,
  start 就是 1,
  第一个 tick 就是 start * step = 0.5
*/
/*
  比如 min 是 0.04 ,step 是 0.05,
  start 就是 1,
  第一个 tick 就是 start * step = 0.05
*/

export function ticks(min, max, count) {
  if (min === max) return [min];
  const step = tickStep(min, max, count);
  const start = Math.ceil(min / step);
  const stop = Math.floor(max / step);
  /* const n = Math.ceil(stop - start + 1); */
  const n = stop - start + 1;
  const values = new Array(n);
  for (let i = 0; i < n; i += 1) {
    values[i] = round(start * step + i * step); // 第一个 tick 是 start * step
  }
  return values;//
}
