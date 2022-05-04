/*

    Quantize 比例尺根据值域的属性个数帮我们确定间隔相同的阈值, 从而把定义域分组.

*/

import { createThreshold } from './threshold';

export function createQuantize({ domain: [d0, d1], range, ...rest }) {
  const n = range.length - 1;// 要生成 n 个阈值(阈值像刻度也是包在上下限内的)
  const step = (d1 - d0) / (n + 1);
  const quantizeDomain = new Array(n).fill(0).map((_, i) => step + step * i);
  return createThreshold({ domain: quantizeDomain, range, ...rest });
}
