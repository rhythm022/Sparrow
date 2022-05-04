/*

    Quantize 比例尺根据定义域的上下限和要划分的数量, 把定义域划分.

    Quantize 比例尺是平均划分定义域.

    划分的数量由值域的属性个数确定.

*/

import { createThreshold } from './threshold';

export function createQuantize({ domain: [d0, d1], range, ...rest }) {
  const n = range.length - 1;//  n + 1 组要生成 n 个阈值
  const step = (d1 - d0) / (n + 1);
  const quantizeDomain = new Array(n).fill(0).map((_, i) => step + step * i);// 阈值像刻度也是包在上下限内的
  return createThreshold({ domain: quantizeDomain, range, ...rest });
}
