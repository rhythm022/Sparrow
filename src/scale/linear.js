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
    const t = normalize(x, d0, d1);// 归一化 // 假如拓展(nice)过, 以拓展后的新 domin 做 scale
    return interpolate(t, r0, r1);
  };
  scale.nice = (tickCount = 10) => { // nice: 伸长 domin
    if (d0 === d1) return;
    const step = tickStep(d0, d1, tickCount);
    [d0, d1] = nice([d0, d1], { // 更新 d0 d1 // 1. 用旧 domin 算出来的 step 来伸长 domin
      floor: (x) => floor(x, step),
      ceil: (x) => ceil(x, step),
    });
  };
  scale.ticks = (tickCount = 10) => ticks(d0, d1, tickCount);// 2. 新 domin 的 step/ticks 变大

  return scale;
}
