import { group } from '../utils';

export function createStackY() {
  return ({ index, values }) => {
    const { y: Y, x: X } = values;
    const series = X ? Array.from(group(index, (i) => X[i]).values()) : [index];// 根据 x 特征值对 index 分组
    const newY = new Array(index.length);// 新的 y1 y 特征通道
    const newY1 = new Array(index.length);
    for (const I of series) { // 计算确定每个实体的 y1 y 值
      for (let py = 0, i = 0; i < I.length; py = newY[I[i]], i += 1) {
        const index = I[i];
        newY1[index] = py;
        newY[index] = py + Y[index];
      }
    }
    return {
      index,
      values: { ...values, y: newY, y1: newY1 }, // 返回修改后的 y 通道的值，并且新增一个 y1 通道
    };
  };
}
