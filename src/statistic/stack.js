import { group } from '../utils';

export function createStackY() {
  return ({ index, values }) => {
    const { y: Y, x: X } = values;
    const series = X ? Array.from(group(index, (i) => X[i]).values()) : [index];// 根据 x 对实体分组
    const newY = new Array(index.length);
    const newY1 = new Array(index.length);
    for (const I of series) { // 同组的实体垒起来 // 形成实体的 y1 y 通道
      for (let py = 0, i = 0; i < I.length; py = newY[I[i]], i += 1) {
        const index = I[i];
        newY1[index] = py;
        newY[index] = py + Y[index];
      }
    }
    return { // 返回垒起来的数据实体列表
      index,
      values: { ...values, y: newY, y1: newY1 },
    };
  };
}
