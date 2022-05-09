/*
    间隔是一种很强大的几何图形,

    用它可以绘制出很多图表：条形图，柱状图，瀑布图，玫瑰图，甜甜圈，饼图.

*/

import { createChannel, createChannels } from './channel';
import { channelStyles } from './style';
import { rect } from './shape';
import { createGeometry } from './geometry';

const channels = createChannels({
  x: createChannel({ name: 'x', scale: 'band', optional: false }),
  y1: createChannel({ name: 'y1', optional: false }),
  z: createChannel({ name: 'z', scale: 'band' }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {
    z: 0,
    x: 0,
  };
  const { x, z } = scales;
  const {
    x: X, y: Y, y1: Y1, z: Z = [],
  } = values;
  // 假设 x 表达为三等分, z 表达为二等分, padding 占 0.1 , 那么在 x 方向上:
  const groupWidth = x.bandWidth();// 大 band 占画布 0.290, 大 padding 占 0.032
  const intervalWidth = z && z.bandWidth ? z.bandWidth() : 1;// 小 band 占大 band 0.426
  const width = groupWidth * intervalWidth;// 所以, 小 band 宽 0.124 = 0.290 * 0.426
  return Array.from(I, (i) => {
    const { z: dz, x: dx, ...restDefaults } = defaults;

    const offset = (Z[i] || dz) * groupWidth;// 后一个小 band 从 0.145 = 0.290 * 0.5 处开始( 小 band + 小 padding 占据大 band 一半)
    const x1 = (X[i] || dx) + offset;

    return rect(renderer, coordinate, { // 绘制小 band
      ...restDefaults,
      ...directStyles,
      ...channelStyles(i, values),
      x1,
      x2: x1 + width,
      y1: Y[i],
      y2: Y1[i],
    });
  });
}

export const interval = createGeometry(channels, render);
