/*
    一个格子的 x y 通道是传入的, x y 表明这个格子的起始点,

    但一个格子的宽高是分别由水平方向和竖直方向的所有格子总数来决定的,

    这个计算宽高的过程由 band 比例尺实现, 我们传给 band 比例尺的 domin 列表里面有几个元素, 就对应这个方向有几个格子

    我认为这是个有趣的实现
*/

import { createChannels, createChannel } from './channel';
import { createGeometry } from './geometry';
import { rect } from './shape';
import { channelStyles } from './style';

const channels = createChannels({
  x: createChannel({ name: 'x', scale: 'band', optional: false }),
  y: createChannel({ name: 'y', scale: 'band', optional: false }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {};
  const { x, y } = scales;
  const { x: X, y: Y } = values;
  const width = x.bandWidth();
  const height = y.bandWidth();
  return Array.from(I, (i) => rect(renderer, coordinate, { // 一个一个绘制格子
    ...defaults,
    ...directStyles,
    ...channelStyles(i, values),
    x1: X[i], // 格子左上
    y1: Y[i],
    x2: X[i] + width, // 格子右下
    y2: Y[i] + height,
  }));
}

export const cell = createGeometry(channels, render);
