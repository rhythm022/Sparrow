/*

    Ordinal scale 是离散 domin 映射为离散 range.

    Band scale 将离散 domin 映射为连续 range, 用于条形图中确定条的位置.

    一个离散 domin 值映射为 range 中的一段长度.

 */

import { createOrdinal } from './ordinal';

function band({ // 主要是返回连续 range 中对应离散 domin 的那些点
  domain, range, padding, margin = padding,
}) {
  const [r0, r1] = range;
  const n = domain.length;
  const step = (r1 - r0) / (margin * 2 + n - padding);
  const bandWidth = step * (1 - padding);
  const x = (_, i) => r0 + margin * step + step * i;

  return {
    bandRange: new Array(n).fill(0).map(x), // bandRange 列表元素是每个 domin 值对应的长度的起点坐标
    step, // step 是长度的总长 =  bandWidth + padding
    bandWidth,
  };
}

export function createBand(options) {
  const { bandRange, bandWidth, step } = band(options);
  const scale = createOrdinal({ ...options, range: bandRange });

  scale.bandWidth = () => bandWidth;
  scale.step = () => step;

  return scale;
}
