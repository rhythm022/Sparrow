import {
  bisect, ticks, identity, group, tickStep, floor, ceil, firstOf, min, max,
} from '../utils';

// 这里的 values 是实体的特征
// 根据特征通道中最小最大值, 划分出特征的区间
function bin(values, count = 10, accessor = identity) { // 比如特征最小值 3 最大值 33
  const minValue = min(values, accessor);
  const maxValue = max(values, accessor);
  const step = tickStep(minValue, maxValue, count);// step === 2
  let niceMin = floor(minValue, step);// 使特征作用范围变宽 [ 2, 34 ]
  let niceMax = ceil(maxValue, step);
  const newStep = tickStep(niceMin, niceMax, count);// 因为作用范围变宽导致区间(step)也变宽了 === 5

  const thresholds = ticks(niceMin, niceMax, count);// 变宽的具体区间 [5, 10, 15, 20, 25, 30]
  niceMin = floor(niceMin, newStep);// 求出与新区间匹配的特征上下限 0 35
  niceMax = ceil(niceMax, newStep);

  return Array.from(new Set([
    niceMin,
    ...thresholds,
    niceMax,
  ]));
}

export function createBinX({ count = 10, channel, aggregate = (values) => values.length } = {}) {
  return ({ index, values }) => {
    const {
      x: X, x1, ...rest
    } = values;// values 是实体的列表
    const restChannels = Object.keys(rest);
    const thresholds = bin(X, count);// 选取实体的某个特征, 根据该特征区分实体, 在这里是根据 x 特征划分实体
    const n = thresholds.length;
    const groups = group(index, (i) => bisect(thresholds, X[i]) - 1); // 666 // 左开右闭比如 (25,30], 实体 x = 28 会被归到 25, x = 30 也被归到 25
    const I = new Array(n - 1).fill(0).map((_, i) => i);

    return { // 根据原始实体的特征生成区间实体的特征返回
      index: I.filter((i) => groups.has(i)), // 有实体的区间
      values: Object.fromEntries([
        ...restChannels.map((channel) => [channel, I.map((i) => { // 比如区间的 y 特征 === 该区间的第一个实体的 y 值
          if (!groups.has(i)) return undefined;
          return values[channel][firstOf(groups.get(i))];
        })]),
        ['x', thresholds.slice(0, n - 1)], // 区间
        ['x1', thresholds.slice(1, n)],
        [channel, I.map((i) => { // 新增的该区间的统计信息的通道, 在这里, 统计了每个区间的实体总数
          if (!groups.has(i)) return 0;
          return aggregate(groups.get(i).map((index) => values[index]));
        })],
      ]),
    };
  };
}
