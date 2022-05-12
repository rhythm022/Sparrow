import { group } from '../utils';

export function createNormalizeY() {
  return ({ index, values }) => {
    const { x: X } = values;
    const series = X ? Array.from(group(index, (i) => X[i]).values()) : [index];// 根据 x 特征值对 index 分组
    const newValues = Object.fromEntries(// 空的 y1 y 特征通道
      ['y1', 'y']
        .filter((key) => values[key])
        .map((key) => [key, new Array(index.length)]),
    );
    for (const I of series) { // 每个 index 分组 // 计算确定每个实体的 y1 y 值
      const Y = I.flatMap((i) => Object.keys(newValues).map((key) => values[key][i]));// 找到该分组最大的 y (即该 x 列最大的 y)
      const n = Math.max(...Y);
      for (const i of I) {
        for (const key of Object.keys(newValues)) {
          newValues[key][i] = values[key][i] / n; // 除以 maxY 以归一化
        }
      }
    }
    return {
      index,
      values: {
        ...values,
        ...newValues,
      },
    };
  };
}
