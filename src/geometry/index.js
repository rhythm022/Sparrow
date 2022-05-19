/*

    geometry 由通道值描述, 是画布上的实体,可以简称画布实体.

    通道是实体某个特征的向量描述.一个向量中的元素互不相关.

    x y color 是 geometry 实体最直白且普遍的通道.(color 包含 fill stroke)

*/
export { point } from './point';
export { text } from './text';
export { link } from './link';
export { line } from './line';
export { area } from './area';
export { rect } from './rect';
export { cell } from './cell';
export { interval } from './interval';
export { path } from './path';
