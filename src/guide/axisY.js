import { createAxis } from './axis';
import { ticksTop, ticksLeft, ticksCircular } from './ticks';
import {
  gridCircular, gridHorizontal, gridRay, gridVertical,
} from './grid';
import { labelTopRight, labelLeftUp } from './label';

const components = {
  '00': {
    start: (d, scale, offset) => [0, scale(d) + offset],
    end: (coordinate) => coordinate([1, 0]),
    grid: gridHorizontal,
    ticks: ticksLeft,
    label: labelLeftUp,
  },
  '01': {
    start: (d, scale, offset) => [0, scale(d) + offset],
    end: (coordinate) => coordinate([1, 0]),
    grid: gridVertical,
    ticks: ticksTop,
    label: labelTopRight,
  },
  10: {
    start: (d, scale, offset) => [0, scale(d) + offset],
    end: (coordinate) => coordinate.center(),
    grid: gridCircular,
    ticks: ticksLeft,
  },
  11: {
    start: (d, scale, offset) => [0, scale(d) + offset],
    end: (coordinate) => coordinate.center(),
    grid: gridRay,
    ticks: ticksCircular,
  },
};

export const axisY = createAxis(components);
