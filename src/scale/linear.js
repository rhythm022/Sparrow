import {
  tickStep, ticks, floor, ceil, normalize, nice,
} from '../utils';
import { interpolateNumber } from './interpolate';

export function createLinear({
  domain: [d0, d1],
  range: [r0, r1],
  interpolate = interpolateNumber,
}) {
  const scale = (x) => {
    const t = normalize(x, d0, d1);// 假如 nice 过,以拓展后的新作用域做归一化然后映射值域
    return interpolate(t, r0, r1);
  };

  scale.ticks = (tickCount = 10) => ticks(d0, d1, tickCount);// 2. 新作用域的新 tickStep 间隔可能变大
  scale.nice = (tickCount = 10) => { // nice === 拓展作用域
    if (d0 === d1) return;
    // the first time
    const step = tickStep(d0, d1, tickCount);// 1. 用旧作用域[d0, d1]算出来的旧 tickStep 来确定新作用域[d0, d1]
    [d0, d1] = nice([d0, d1], {
      floor: (x) => floor(x, step),
      ceil: (x) => ceil(x, step),
    });
  };

  return scale;
}
