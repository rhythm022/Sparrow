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
  const value = createLinear({ domain: [0, width], range: domainValues });// Ramp 的长和 domin 相互映射
  const position = createLinear({ domain: domainValues, range: [0, width] });

  for (let i = 0; i < width; i += 1) {
    const stroke = scale(value(i));
    renderer.line({ // 显示 domin 映射到的颜色视觉属性
      x1: i, y1: legendY, x2: i, y2: legendY + height, stroke,
    });
  }

  const values = scale.thresholds ? [
    domainValues[0],
    ...scale.thresholds(), // thresholds === ticks
    domainValues[1],
  ] : position.ticks(tickCount);

  const ticks = values.map((d) => ({
    x: position(d), // domin 映射到位置视觉属性
    y: legendY,
    text: formatter(d), // 显示 domin 的刻度列表
  }));
  ticksBottom(renderer, ticks, { fontSize, tickLength });

  renderer.restore();
}
