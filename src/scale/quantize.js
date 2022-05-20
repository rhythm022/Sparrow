/*
    quantize scale 将连续 domin 分组到离散 range

    quantize scale 是根据 range 个数平分 domin, 每个 domin 区间的长度相等.

    quantize scale 划分的每个 domin 区间里的实体数量如果不均匀, 说明实体在 domin 上不均匀.

*/

import { createThreshold } from './threshold';

export function createQuantize({ domain: [d0, d1], range, ...rest }) {
  const step = (d1 - d0) / range.length;
  const n = range.length - 1;// n 个阈值// 阈值和刻度一样只在上下限内画
  const quantizeDomain = new Array(n).fill(0).map((_, i) => step + step * i);
  return createThreshold({ domain: quantizeDomain, range, ...rest });
}
