/*
    quantile scale 将连续 domin 分组到离散 range

    quantile scale 把实体排名, 产生名次等第, 据此把 domin 划分. 每个 domin 区间的实体数量基本相等.

    range 有 n 个等第, quantile scale 就划出 n 个 domin 等第区间.

*/
import { createThreshold } from './threshold';

export function createQuantile({ domain, range, ...rest }) {
  const sortedDomain = domain.sort((a, b) => a - b);// 从小到大排名
  // 比如有 8 个实体, 4 个等第, 那么 step = 1.75, 表明一个区间至少包含前第 1.75 位实体
  // 比如有 9 个实体, 4 个等第, 那么 step = 2, 表明一个区间至少包含前第 2 位实体
  // 比如有 1000 个实体, 4 个等第, 那么 step = 249.75, 表明一个区间至少包含前第 249.75 位实体
  const step = (domain.length - 1) / range.length;
  const n = range.length - 1;// threshold 个数 = 3

  const quantileDomain = new Array(n).fill(0).map((_, index) => {
    const i = step + index * step;// 虚拟排名 i =            [  1.75,  3.5,  5.25  ]  [  2,  4,  6  ] [   249.75,  499.5,  749.25  ]
    const i0 = Math.floor(i); const i1 = i0 + 1;// 排名 i0 = [ 1,     3,    5      ] [  2,  4,  6  ] [   249,     499,    749     ]
    const v0 = sortedDomain[i0]; const v1 = sortedDomain[i1];
    return v0 * (i1 - i) + v1 * (i - i0);// v0 v1 是前后毗邻的实体 // 还原出 v0 v1 中间的虚拟实体作为 threshold
  });
  // 8 个实体,    4 个等第: 0 1   / 2 3 / 4 5 / 6 7
  // 9 个实体,    4 个等第: 0 1 2 / 3 4 / 5 6 / 7 8
  // 1000 个实体, 4 个等第: 0...249 / 250...499 / 500...749 / 750...999
  return createThreshold({ domain: quantileDomain, range, ...rest });
}
