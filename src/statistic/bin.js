import {
  bisect, ticks, identity, group, tickStep, floor, ceil, firstOf, min, max, map,
} from '../utils';

// bin 接受 values 某通道的值列表, 为该通道生成区间表.
// 过程与为 domin 生成 ticks 类似.
function bin(values, count = 10, accessor = identity) { // 比如通道最小值 3 最大值 33
  const minValue = min(values, accessor);
  const maxValue = max(values, accessor);
  const step = tickStep(minValue, maxValue, count);// 原始 step = 2
  let niceMin = floor(minValue, step);// 伸长通道范围至[ 2, 34 ]
  let niceMax = ceil(maxValue, step);
  const newStep = tickStep(niceMin, niceMax, count);// 通道范围变长导致每个区间长度变长 step = 5
  const thresholds = ticks(niceMin, niceMax, count);// 具体为 [5, 10, 15, 20, 25, 30]
  niceMin = floor(niceMin, newStep);// 区间长度变长反过来导致通道范围变长 [ 0, 35 ]
  niceMax = ceil(niceMax, newStep);

  return Array.from(new Set([
    niceMin, // 有头有尾
    ...thresholds,
    niceMax,
  ]));
}

// 根据 x 区间返回组实体 // 比如 x = 26 27 28 29 30 的实体生成一个组实体 (25,30], 和其他组实体一起返回.
export function createBinX({ count = 10, channel, aggregate = (values) => values.length } = {}) {
  return ({ index, values }) => {
    const {
      x: X, x1, ...rest
    } = values;// 原数据实体
    const thresholds = bin(X, count);// x 通道的区间表
    const groups = group(index, (i) => bisect(thresholds, X[i]) - 1); // 组实体到组内实体索引的一对多映射
    const n = thresholds.length;
    const restChannels = Object.keys(rest);
    const I = new Array(n - 1).fill(0).map((_, i) => i);// 组实体的索引

    return { // 返回组实体
      index: I.filter((i) => groups.has(i)), // 有效的组实体的索引
      values: Object.fromEntries([
        ...restChannels.map((channel) => [channel, I.map((i) => { // 组实体的原始通道, 保留了组内第一位实体的通道
          if (!groups.has(i)) return undefined;
          return values[channel][firstOf(groups.get(i))];
        })]),
        [channel, I.map((i) => { // 组的统计通道, 可以自定义. 默认统计组区间的实体量.
          if (!groups.has(i)) return 0;
          return aggregate(groups.get(i).map((index) => map(values, (value) => value[index])));// aggregate 的入参是组内实体列表
        })],
        ['x', thresholds.slice(0, n - 1)], // 组的区间起点
        ['x1', thresholds.slice(1, n)], // 组的区间终点
      ]),
    };
  };
}
