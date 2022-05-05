/*
    任何的坐标系变换都是将统计学上的点(线性)转换成画布上的点.

    即坐标系 === transforms.不同的坐标系就是不同的 transforms.

*/

import { curry } from '../utils';
import { scale, translate } from './transform';

// transformOptions 在定义坐标系的时候需要用户指定,
// canvasOptions 是在执行坐标系函数的时候被传入的，两者被传入的时间不同。
export const cartesian = curry(coordinate);

function coordinate(transformOptions, canvasOptions) {
  const {
    x, y, width, height,
  } = canvasOptions;

  return [
    scale(width, height),
    translate(x, y),
  ];
}
