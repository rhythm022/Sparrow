import { createLinear } from '../scale';
import { firstOf, identity, lastOf } from '../utils';
import { ticksBottom } from './ticks';

export function legendRamp(renderer, scale, coordinate, {
  x,
  y,
  width = 120, // Ramp 的长
  height = 10, // Ramp 的高
  domain,
  tickCount = 5,
  tickLength = height + 5,
  formatter = identity,
  fontSize = 10,
  label,
}) {
  renderer.save();
  renderer.translate(x, y);

  if (label) {
    renderer.text({
      text: label, x: 0, y: 0, fontWeight: 'bold', fontSize, textAnchor: 'start', dy: '1em',
    });
  }

  const legendY = label ? height * 2 : 0;
  const domainValues = [firstOf(domain), lastOf(domain)];
  const value = createLinear({ domain: [0, width], range: domainValues });// 1. 在 domin 范围内的所有数据实体值都占据某一位置
  const position = createLinear({ domain: domainValues, range: [0, width] });

  for (let i = 0; i < width; i += 1) {
    const stroke = scale(value(i));// 2. 在该位置, 该数据实体值对应的 color
    renderer.line({ // 画出来
      x1: i, y1: legendY, x2: i, y2: legendY + height, stroke,
    });
  }

  const values = scale.thresholds ? [
    domainValues[0],
    ...scale.thresholds(), // thresholds === ticks
    domainValues[1],
  ] : position.ticks(tickCount);

  const ticks = values.map((d) => ({
    x: position(d), // 3. 在其中的特殊位置(即刻度), 该数据实体值
    y: legendY,
    text: formatter(d), // 画出来
  }));
  ticksBottom(renderer, ticks, { fontSize, tickLength });

  renderer.restore();
}
