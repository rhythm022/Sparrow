/*

    分布比例尺用来探索数据的分布.

    分布比例尺将连续数据分组离散，一组使用同一个颜色来编码.

    不同的分组方式使用不同的分布比例尺，Threshold Quantile and Quantize

    首先是 Threshold 比例尺，它的定义域是连续的.

    定义域被指定的分割值分成不同的组.

*/

import { bisect } from '../utils';

export function createThreshold({ domain: thresholds, range }) {
  const n = Math.min(thresholds.length, range.length - 1);
  const scale = (x) => {
    const index = bisect(thresholds, x);// 确定第一个够不着的阈值
    return range[index === -1 ? n : index];// 都够得着就使用 range 最后一个颜色
  };

  scale.thresholds = () => thresholds;
  return scale;
}
