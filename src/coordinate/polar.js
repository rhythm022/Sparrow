import {
  translate, scale, reflectY, polar as polarT,
} from './transform';
import { curry } from '../utils/helper';

function coordinate(transformOptions, canvasOptions) {
  const { width, height } = canvasOptions;
  const {
    innerRadius = 0,
    outerRadius = 1,
    startAngle = -Math.PI / 2,
    endAngle = (Math.PI / 2) * 3,
  } = transformOptions;
  const aspect = width / height;
  const sx = aspect > 1 ? 1 / aspect : 1;
  const sy = aspect > 1 ? 1 : aspect;
  return [
    // https://juejin.cn/book/7031893648145186824/section/7032095221764587550
    // x 是角度坐标, y 是半径坐标

    // 映射为自己的补值
    // 例如 0.3 => 0.7
    //     0.7 => 0.3
    // ??
    translate(0, -0.5),
    reflectY(),
    translate(0, 0.5),

    // 把 0 到 1 的角度 x 调整到 startAngle 到 endAngle 的范围
    // 把 0 到 1 的半径 y 调整到 innerRadius 到 outerRadius 的范围
    // 例如 0 => innerRadius 以及 1 => outerRadius
    scale(endAngle - startAngle, outerRadius - innerRadius),
    translate(startAngle, innerRadius), // 1. 把 0 到 1 的 x y 调整进内外半径起始角终点角规定的扇形

    polarT(), // 2. 调整进扇形后做极坐标转换.用于在笛卡尔画布上绘图.

    // 3. 转换后 x y 回到了 0 到 1 的范围
    scale(sx * 0.5, sy * 0.5),
    translate(0.5, 0.5), // 调整成正圆扇形, 放到画布中心(即第四象限)
  ];
}

export const polar = curry(coordinate);
