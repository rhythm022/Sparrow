/*
    Quantile 比例尺根据样本排名后的名次等第,把定义域划分.

    Quantize 比例尺划分定义域是不平均的,因为样本在定义域上是不平均的.

    划分的数量由值域的属性个数确定.

*/
import { createThreshold } from './threshold';

export function createQuantile({ domain, range, ...rest }) {
  const n = range.length - 1;
  const sortedDomain = domain.sort((a, b) => a - b);
  const step = (sortedDomain.length - 1) / (n + 1);
  const quantileDomain = new Array(n).fill(0).map((_, index) => { // 根据定义域上样本的情况, 把定义域划分.
    const i = step + index * step;// i 是虚拟的
    const i0 = Math.floor(i); const i1 = i0 + 1;
    const v0 = sortedDomain[i0]; const v1 = sortedDomain[i1];// i0 i1 是分布在 i 左右的存在的值
    return v0 * (i1 - i) + v1 * (i - i0);
  });
  return createThreshold({ domain: quantileDomain, range, ...rest });
}
