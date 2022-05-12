import { group } from '../utils';

export function createSymmetryY() {
  return ({ index, values }) => {
    const { x: X } = values;
    const series = X ? Array.from(group(index, (i) => X[i]).values()) : [index];// 根据 x 特征值对 index 分组
    const newValues = Object.fromEntries(// 空的 y1 y 特征通道
      ['y1', 'y']
        .filter((key) => values[key])
        .map((key) => [key, new Array(index.length)]),
    );

    const M = new Array(series.length);
    for (const [i, I] of Object.entries(series)) {
      const Y = I.flatMap((i) => Object.keys(newValues).map((key) => values[key][i]));
      const min = Math.min(...Y);
      const max = Math.max(...Y);
      M[i] = (min + max) / 2; // 计算每个分组里所有实体的 y 平均值
    }

    const maxM = Math.max(...M);// 所有分组中最大值
    for (const [i, I] of Object.entries(series)) {
      const offset = -M[i] + maxM;
      for (const i of I) {
        for (const key of Object.keys(newValues)) {
          newValues[key][i] = values[key][i] + offset;// 下移 上移
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
