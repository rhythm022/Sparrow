import { createChannel, createChannels } from './channel';
import { createGeometry } from './geometry';
import { circle } from './shape';
import { channelStyles } from './style';
// point 的 channels (特征)有 x y r stroke fill 五个
const channels = createChannels({
  r: createChannel({ name: 'r' }),
});

const defaults = {
  r: 3,
  fill: 'none',
};

// 对每一个样本使用特征做渲染 ( 调用 circle 做渲染)
function render(renderer, I, scales, values, directStyles, coordinate) {
  const { r: dr, ...restDefaults } = defaults;

  const { x: X, y: Y, r: R = [] } = values;

  return Array.from(I, (i) => circle(renderer, coordinate, {
    ...restDefaults,
    ...directStyles,
    ...channelStyles(i, values), // 特征 stroke & fill
    cx: X[i], // 特征 x
    cy: Y[i], // 特征 y
    r: R[i] || dr, // 特征 r
  }));
}

export const point = createGeometry(channels, render);
