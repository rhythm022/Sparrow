/*
  创建比例尺三个比较重要的职责：
  补全比例尺类型
  补全定义域
  补全值域
*/

import {
  firstOf, group, lastOf, map, defined,
} from '../utils';
import { interpolateColor, interpolateNumber } from '../scale';
import { categoricalColors, ordinalColors } from './theme';

export function inferScales(channels, options) { // channels 是不同实体的通道对象的列表. 除了 layer facet, 列表中都是只有一个对象.
  const scaleChannels = group(channels.flatMap(Object.entries), ([name]) => scaleName(name));// name === 通道名 // 预处理: 把 x x1 / y y1 / fill stroke 分为一组
  const scales = {};
  for (const [name, channels] of scaleChannels) { // name === 'x' | 'y' | 'color' | 'z' 组名...
    const channel = mergeChannels(name, channels);// 预处理: 把比如 x x1 的 values scale 等合并. 如果是 z 通道, 并不改变什么.
    const o = options[name] || {};// 用户能传入 padding nice zero label type domin range interpolate 等配置项
    const type = inferScaleType(channel, o);// 用户指定的 domin 很长或其中含有字符串, 就可判定为 'ordinal' 比例尺, 否则 'linear' 比例尺居多.
    scales[name] = {
      type,
      ...o, // 用户传入的配置
      domain: inferScaleDomain(type, channel, o), // 根据比例尺定义域是连续的还是离散的, 把通道值作为定义域
      range: inferScaleRange(type, channel, o), // 根据比例尺值域是连续的还是离散的, 值域默认为 0 到 1 或那几个颜色
      ...inferScaleOptions(type, channel, o), // 补全该类型比例尺所需的特殊配置比如 interpolate 函数
      label: inferScaleLabel(type, channel, o), // 用户指定的 field 作为 label
    };
  }

  return scales;// 返回 geometry 实体各通道组对应的比例尺类型/比例尺作用域值域/比例尺 label
}

export function applyScales(channels, scales) {
  return map(channels, ({ values, name }) => {
    const scale = scales[scaleName(name)];
    return values.map(scale);
  });
}

function scaleName(name) {
  if (name.startsWith('x')) return 'x';
  if (name.startsWith('y')) return 'y';
  if (isColor(name)) return 'color';
  return name;
}

function mergeChannels(name, channels) { // merge 比如 stroke 通道和 fill 通道
  const values = [];
  let scale;
  let field;
  for (const [, { values: v = [], scale: s, field: f }] of channels) {
    values.push(...v);// 通道值连在一起, 用于接下来确定比例尺的作用域
    if (!scale && s) scale = s;// stroke fill 有一个 scale, color 就有 scale(即 stroke fill 共用一个比例尺)
    if (!field && f) field = f;// 同样
  }
  return {
    name, scale, values, field,
  };
}

function inferScaleType({ name, scale, values }, { type, domain, range }) { // name === 组名
  if (scale) return scale;// 通道有要求(比如 interval 的 x 通道只能是 band scale)
  if (type) return type;// 用户有直接指定
  if ((domain || range || []).length > 2) return asOrdinalType(name);// 用户指定的 domain(或 range)长度超过 2, 则间接肯定不是连续比例尺, 是离散比例尺 'dot' | 'ordinal'
  if (domain !== undefined) {
    if (isOrdinal(domain)) return asOrdinalType(name);// 用户指定的 domain 里有 string boolean, 间接确定是离散比例尺 'dot' | 'ordinal'
    if (isTemporal(domain)) return 'time';
    return 'linear';
  }
  if (isOrdinal(values)) return asOrdinalType(name);// 用户没有指定 type 和 domain, 就根据实际通道值判断
  if (isTemporal(values)) return 'time';
  if (isUnique(values)) return 'identity';
  return 'linear';
}

function inferScaleDomain(type, { values }, { domain, ...options }) {
  if (domain) return domain;
  switch (type) {
    case 'linear':
    case 'log':
    case 'quantize':
      return inferDomainQ(values, options);// 连续的 domin: 取通道值上下限
    case 'ordinal':
    case 'dot':
    case 'band':
      return inferDomainC(values, options);// 离散的 domin: 通道值去重
    case 'quantile':
      return inferDomainO(values, options);// 离散的 domin: 通道值去重排序
    case 'time':
      return inferDomainT(values, options);
    default:
      return [];
  }
}

function inferScaleRange(type, { name }, { range }) {
  if (range) return range;
  switch (type) {
    case 'linear':
    case 'log':
    case 'time':
    case 'band':
    case 'dot':
      return inferRangeQ(name);// 连续的 range: 0 到 1
    case 'ordinal':
      return categoricalColors;
    case 'quantile':
    case 'quantize':
    case 'threshold':
      return ordinalColors;//  离散的 range: 颜色列表
    default:
      return [];
  }
}

function inferScaleOptions(type, { name }, { padding, interpolate, margin }) {
  switch (type) {
    case 'linear': case 'log':
      if (interpolate) return { interpolate };
      return { interpolate: name === 'color' ? interpolateColor : interpolateNumber };
    case 'band':
      return { padding: padding !== undefined ? padding : 0.1 };
    case 'dot':
      return { margin: margin !== undefined ? margin : 0.5 };
    default:
      return {};
  }
}

function inferScaleLabel(type, { field }, { label }) {
  if (label !== undefined) return label;
  return field;
}

function asOrdinalType(name) {
  if (isPosition(name)) return 'dot';// 实体的 x y 通道默认 point 比例尺
  return 'ordinal';
}

function isPosition(name) {
  return name === 'x' || name === 'y';
}

function isColor(name) {
  return name === 'fill' || name === 'stroke';
}

function isOrdinal(values) { // domin 值有字符串 true false, 就是离散比例尺
  return values.some((v) => {
    const type = typeof v;
    return type === 'string' || type === 'boolean';
  });
}

function isTemporal(values) {
  return values.some((v) => v instanceof Date);
}

function isUnique(values) {
  return Array.from(new Set(values)).length === 1;
}

function inferDomainQ(values, { zero = false } = {}) {
  const definedValues = values.filter(defined);
  if (definedValues.length === 0) return [];
  const min = Math.min(...definedValues);
  const max = Math.max(...definedValues);
  return [zero ? 0 : min, max];// zero 为 true 时, 把作用域下限固定在 0
}

function inferDomainC(values) {
  return Array.from(new Set(values.filter(defined)));
}

function inferDomainO(values, domain) {
  return inferDomainC(values, domain).sort();
}

function inferDomainT(values, domain) {
  return inferDomainQ(values, domain).map((d) => new Date(d));
}

function inferRangeQ(name) {
  if (name === 'y') return [1, 0];
  if (name === 'color') return [firstOf(ordinalColors), lastOf(ordinalColors)];// 666
  return [0, 1];
}
