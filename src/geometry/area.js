/*

    两条直线(上线和下线)首尾连接起来成一个区域.

    所以, 区域多了 x1 y1 通道, 用来描述这个区域的下线

*/

import { createChannel, createChannels } from './channel';
import { groupChannelStyles } from './style';
import { area as shapeArea } from './shape';
import { group } from '../utils';
import { createGeometry } from './geometry';

const channels = createChannels({
  x1: createChannel({ name: 'x1', optional: false }),
  y1: createChannel({ name: 'y1', optional: false }),
  z: createChannel({ name: 'z' }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {};
  const {
    x: X, y: Y, z: Z, x1: X1, y1: Y1,
  } = values;
  const series = Z ? group(I, (i) => Z[i]).values() : [I];
  return Array.from(series, (I) => shapeArea(renderer, coordinate, {
    ...defaults,
    ...directStyles,
    ...groupChannelStyles(I, values),
    X1: X, // 上线
    Y1: Y, // 上线
    X2: X1, // 下线
    Y2: Y1, // 下线
    I,
  }));
}

export const area = createGeometry(channels, render);
