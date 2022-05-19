/*

    scale 是对 geometry 实体的每个通道, 在 domin/range 范围内做一维的伸缩变形

    连续型 scale 有 ticks, 是给 guide 使用.

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
