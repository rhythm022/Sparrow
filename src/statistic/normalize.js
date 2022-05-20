import { group } from '../utils';

export function createNormalizeY() {
  return ({ index, values }) => {
    const { x: X } = values;
    const series = X ? Array.from(group(index, (i) => X[i]).values()) : [index];// 根据 x 对实体分组
    const newValues = Object.fromEntries(// 666
      ['y1', 'y']
        .filter((key) => values[key])
        .map((key) => [key, new Array(index.length)]), // key === 'y1' | 'y'
    );
    for (const I of series) { // for 一列
      const Y = I.flatMap((i) => Object.keys(newValues).map((key) => values[key][i]));// y y1 值混在一起
      const maxY = Math.max(...Y);// 该 x 列最大的 y1 | y
      for (const i of I) {
        for (const key of Object.keys(newValues)) {
          newValues[key][i] = values[key][i] / maxY; // 除以 maxY 以归一化
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
