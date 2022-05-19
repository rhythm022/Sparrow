import { createChannel, createChannels } from './channel';
import { groupChannelStyles } from './style';
import { line as shapeLine } from './shape';
import { group } from '../utils';
import { createGeometry } from './geometry';

const channels = createChannels({
  z: createChannel({ name: 'z' }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {};
  const { x: X, y: Y, z: Z } = values;
  // I 分裂成 series
  // 即索引列表 [0, 1, 2, 3, 4, 5] 分解成索引列表的列表 [[0, 1, 2, 3],[ 4, 5 ]]
  const series = Z ? group(I, (i) => Z[i]).values() : [I];
  return Array.from(series, (I) => shapeLine(renderer, coordinate, {
    ...defaults,
    ...directStyles,
    ...groupChannelStyles(I, values),
    X, // 向量
    Y, // 向量
    I, // 向量
    fill: 'none',
  }));
}

export const line = createGeometry(channels, render);
