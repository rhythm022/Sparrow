/*

    坐标系是将统计学上的点落到画布上.

    不同的坐标系是不同的画布. 同一个点, 在不同的画布上, 会落到不同的位置.

    任何一个点落到坐标系上,坐标系都知道应该把这个点落在哪儿.

    画一个点, 就是转移一个点.

    坐标系 === transforms.

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
