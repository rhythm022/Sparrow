import { createAxis } from './axis';
import { ticksBottom, ticksLeft, ticksCircular } from './ticks';
import {
  gridCircular, gridHorizontal, gridRay, gridVertical,
} from './grid';
import { labelLeftDown, labelBottomRight } from './label';

const components = {
  '00': {
    start: (d, scale, offset) => [scale(d) + offset, 1], // Ticks start
    end: (coordinate) => coordinate([0, 0]), // Grid end
    grid: gridVertical,
    ticks: ticksBottom,
    label: labelBottomRight,
  },
  '01': { // 转置
    start: (d, scale, offset) => [scale(d) + offset, 1], // 转置后从底部转到左边(坐标系整个顺时钟转 90°)
    end: (coordinate) => coordinate([0, 0]), // 转置后零点在右上角
    grid: gridHorizontal,
    ticks: ticksLeft,
    label: labelLeftDown,
  },
  10: { // 极坐标(放射状)
    start: (d, scale, offset) => [scale(d) + offset, 0],
    end: (coordinate) => coordinate.center(),
    grid: gridRay,
    ticks: ticksCircular,
  },
  11: { // 同心圆
    start: (d, scale, offset) => [scale(d) + offset, 1], // 6666 化繁为简
    end: (coordinate) => coordinate.center(), // 在什么意义上圆心是 Grid end
    grid: gridCircular,
    ticks: ticksLeft,
  },
};

export const axisX = createAxis(components);
