import { compose, indexOf } from '../utils';
import { inferEncodings, valueOf } from './encoding';
import { create } from './create';

export function initialize({ // 确定 type 类型的 geometry
  type,
  encodings: E = {},
  statistics: statisticsOptions = [],
  data,
  transforms: transformsOptions = [],
  styles,
}) {
  // transform
  const transform = compose(...transformsOptions.map(create));// 预处理
  const transformedData = transform(data);// apply
  // encodings
  const encodings = inferEncodings(type, transformedData, E);// 预处理 (完善补全配置)
  const constants = {};
  const values = {};
  for (const [key, e] of Object.entries(encodings)) {
    if (e) {
      const { type, value } = e;
      if (type === 'constant') constants[key] = value;// fill stroke 的 value 类型就是 constant 类型
      else values[key] = valueOf(transformedData, e);// apply (得到各个通道的值 === 得到 geometry 实体)
    }
  }
  // statistic
  const index = indexOf(transformedData);
  const statistic = compose(...statisticsOptions.map(create));// 预处理 (初始化 statistic)
  const { values: transformedValues, index: I } = statistic({ index, values });// apply (调整各个通道的值 === 调整 geometry 实体)

  // 以上的逻辑是算出 values
  const geometry = create({ type });
  const channels = {};
  for (const [key, channel] of Object.entries(geometry.channels())) {
    const values = transformedValues[key];
    const { optional } = channel;
    if (values) {
      channels[key] = createChannel(channel, values, encodings[key]);
    } else if (!optional) {
      throw new Error(`Missing values for channel: ${key}`);
    }
  }

  return { // 返回用于绘制的 geometry 和包含绘制数据的 channels, index
    index: I, geometry, channels, styles: { ...styles, ...constants },
  };
}

function createChannel(channel, values, encoding = {}) {
  const { type, value } = encoding;
  return {
    ...channel,
    ...(type === 'field' && { field: value }), // 只有 field 编码的通道, 才带上用户传入的原始编码配置.
    values,
  };
}
