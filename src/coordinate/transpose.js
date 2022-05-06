/*
    transpose 转置坐标系: 把零点从 (0,0) 移到 (1,0), 然后逆时针 90° 旋转坐标系

*/
import { curry } from '../utils';
import {
  reflectX, translate, transpose as transposeT,
} from './transform';

// eslint-disable-next-line no-unused-vars
function coordinate(transformOptions, canvasOptions) {
  return [
    transposeT(),
    translate(-0.5, 0),
    reflectX(),
    translate(0.5, 0),
  ];

/*
  return [
    transposeT(),
    reflectX(), // 因为 y 映射到了 x 通道, 所以, 反射 x 能使 y 反向
    translate(1, 0), // 因为 y 映射到了 x 通道, 所以, 平移 x 能使 y 平移
  ];

*/
}

export const transpose = curry(coordinate);
