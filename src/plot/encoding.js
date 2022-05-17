/*
    编码本质上就是结合实体和编码配置确定通道值.

    举例:
    const options = {
      type: 'interval',
      data: sports,
      encodings: {
      x: 'genre', // 编码类型 field 最直接, 提取实体指定字段作为实体的 x 通道值
      y: d => d.sold * 2, // 编码类型 transform: 以实体为入参的函数返回作为实体的 y 通道值
      fill: 'steelblue' // 编码类型 value: 无视输入的实体, 直接以 steelblue 作为输出实体的 fill 通道
      }
    }

    inferEncodings 的职责: 预处理 encodings 配置:
        确定用户传入了哪种编码类型,
        补全 geometry 实体所需的所有通道。

*/

import { firstOf, map } from '../utils';
import { categoricalColors } from './theme';

export function inferEncodings(type, data, encodings) {
  const typedEncodings = map(encodings, (encoding, key) => ({ // 显式用户传入的类型: 'transform' 'field' 'constant' 'value'
    type: inferType(data, encoding, key),
    value: encoding,
  }));

  switch (type) { // 666 // 补全 geometry 实体所需的用户可以不填的通道。
    case 'interval':
      return maybeFill(maybeZeroX(maybeZeroY1(typedEncodings)));
    case 'line':
      return maybeStroke(maybeGroup(typedEncodings));
    case 'area':
      return maybeFill(maybeIdentityX(maybeZeroY1(maybeGroup(typedEncodings))));
    case 'link':
      return maybeStroke(maybeIdentityX(typedEncodings));
    case 'point':
      return maybeZeroY(maybeStroke(typedEncodings));
    case 'rect':
      return maybeFill(maybeZeroX1(maybeZeroY1(typedEncodings)));
    case 'cell':
      return maybeFill(typedEncodings);
    default:
      break;
  }

  return typedEncodings;
}

export function valueOf(data, { type, value }) {
  if (type === 'transform') return data.map(value);
  if (type === 'value') return data.map(() => value);
  return data.map((d) => d[value]);// 'field'
}

function inferType(data, encoding, name) {
  if (typeof encoding === 'function') return 'transform';
  if (typeof encoding === 'string') {
    if (data.length && firstOf(data)[encoding] !== undefined) return 'field';
    if (isStyle(name)) return 'constant';// fill stroke 的 value 类型就是 constant 类型
  }
  return 'value';
}

function isStyle(type) {
  return type === 'fill' || type === 'stroke';
}

function maybeFill({ fill = color(), ...rest }) {
  return { fill, ...rest };
}

function maybeStroke({ stroke = color(), ...rest }) {
  return { stroke, ...rest };
}

function maybeZeroY1({ y1 = zero(), ...rest }) {
  return { y1, ...rest };
}

function maybeZeroX1({ x1 = zero(), ...rest }) {
  return { x1, ...rest };
}

function maybeZeroY({ y = zero(), ...rest }) {
  return { y, ...rest };
}

function maybeZeroX({ x = zero(), ...rest }) {
  return { x, ...rest };
}

function maybeIdentityX({ x, x1 = x, ...rest }) { // 没有 x1, 则让 x1 === x
  return { x, x1, ...rest };
}

function maybeGroup({
  fill, stroke, z, ...rest
}) {
  if (z === undefined) z = maybeField(fill);// 假如 fill 通道是 field 类型, 让 z 通道 ===  fill 通道(优先级比 stroke 高)
  if (z === undefined) z = maybeField(stroke);// 假如 stroke 通道是 field 类型, 让 z 通道 ===  stroke 通道
  return {
    fill, stroke, z, ...rest,
  };
}

function maybeField(encoding) {
  if (encoding === undefined || encoding.type !== 'field') return undefined;
  return encoding;
}

function zero() {
  return { type: 'value', value: 0 };
}

function color() {
  return { type: 'constant', value: categoricalColors[0] };
}
