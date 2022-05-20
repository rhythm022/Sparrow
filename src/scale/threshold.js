import { bisect } from '../utils';

export function createThreshold({ domain: thresholds, range }) { // 左开右闭
  const n = Math.min(thresholds.length, range.length - 1);
  const scale = (x) => {
    const index = bisect(thresholds, x);// 第一个阈值位置, 该阈值大于等于 x
    return range[index === -1 ? n : index];// x 超过最大阈值/刻度, 就对应 range 末位
  };

  scale.thresholds = () => thresholds;
  return scale;
}
