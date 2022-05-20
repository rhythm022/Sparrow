/*

    scale 是对 geometry 实体的每个通道, 在 domin/range 范围内做一维的伸缩变形

    拥有连续 domin 的 scale 会有 ticks, 是给 guide 使用. ticks 可以看做是连续 domin 的概要.

    连续到连续: linear.
    离散到连续: band.
    连续到离散: quantile/quantize.

    quantile/quantize 是分布比例尺, 通过给数据分组来探索数据的分布.

*/
export { createBand } from './band';
export { createIdentity } from './identity';
export { createLinear } from './linear';
export { interpolateNumber, interpolateColor } from './interpolate';
export { createLog } from './log';
export { createOrdinal } from './ordinal';
export { createPoint } from './point';
export { createThreshold } from './threshold';
export { createQuantize } from './quantize';
export { createQuantile } from './quantile';
export { createTime } from './time';
