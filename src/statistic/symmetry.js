import { group } from '../utils';

export function createSymmetryY() {
  return ({ index, values }) => {
    const { x: X } = values;
    const series = X ? Array.from(group(index, (i) => X[i]).values()) : [index];// 根据 x 对实体分组
    const newValues = Object.fromEntries(// 666
      ['y1', 'y']
        .filter((key) => values[key])
        .map((key) => [key, new Array(index.length)]), // key === 'y1' | 'y'
    );

    const M = new Array(series.length);
    for (const [i, I] of Object.entries(series)) { // for 一列
      const Y = I.flatMap((i) => Object.keys(newValues).map((key) => values[key][i])); // y y1 值混在一起
      const min = Math.min(...Y);
      const max = Math.max(...Y);
      M[i] = (min + max) / 2; // 每列(垒起来)实体 y 方向上的中间位置
    }
    const maxM = Math.max(...M);// 所有列的中间位置
    for (const [i, I] of Object.entries(series)) {
      const offset = -M[i] + maxM;// 先下移后上移
      for (const i of I) { // execute for 每列的每个实体
        for (const key of Object.keys(newValues)) {
          newValues[key][i] = values[key][i] + offset;
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
