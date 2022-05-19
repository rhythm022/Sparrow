import { createChannel, createChannels } from './channel';
import { createGeometry } from './geometry';
import { circle } from './shape';
import { channelStyles } from './style';
// point 的通道有 x y r stroke fill 五个
const channels = createChannels({
  r: createChannel({ name: 'r' }),
});

const defaults = {
  r: 3,
  fill: 'none',
};

// 对实体通过通道做绘制 ( 调用 circle 做渲染)
function render(renderer, I, scales, values, directStyles, coordinate) {
  const { r: dr, ...restDefaults } = defaults;

  const { x: X, y: Y, r: R = [] } = values;

  return Array.from(I, (i) => circle(renderer, coordinate, {
    ...restDefaults,
    ...directStyles,
    ...channelStyles(i, values), // 通道 stroke fill
    cx: X[i], // 通道 x
    cy: Y[i], // 通道 y
    r: R[i] || dr, // 通道 r
  }));
}

export const point = createGeometry(channels, render);
