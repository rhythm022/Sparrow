/*

    Ordinal 比例尺的值域必须是序数，如果值域是数值，就需要 Band 比例尺

    Band 比例尺用于将序数属性映射为数值属性，常用于条形图中确定条的位置。

    比如将水果名字映射为每个条的位置坐标，位置坐标。

 */

import { createOrdinal } from './ordinal';

/*
    一个序数对应一个长度空间
    bandRange 是列表,列表元素是长度空间的起点坐标
    step 是长度空间的总宽
    step =  band宽(bandWidth) + padding

    传入的 domin 是离散 domin
*/
function band({
  domain, range, padding, margin = padding,
}) {
  const [r0, r1] = range;
  const n = domain.length;

  const step = (r1 - r0) / (margin * 2 + n - padding);

  const bandWidth = step * (1 - padding);

  const x = (_, i) => r0 + margin * step + step * i;

  return {
    bandRange: new Array(n).fill(0).map(x),
    bandWidth,
    step,
  };
}

export function createBand(options) {
  const { bandRange, bandWidth, step } = band(options);// 主要是提供 range
  const scale = createOrdinal({ ...options, range: bandRange });

  scale.bandWidth = () => bandWidth;
  scale.step = () => step;

  return scale;
}
