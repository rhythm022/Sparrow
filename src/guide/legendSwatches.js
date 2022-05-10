import { identity } from '../utils';

export function legendSwatches(renderer, scale, coordinate, {
  x,
  y,
  width = 64, // swatch + text 占据的宽
  marginLeft = 6, // swatch 和 text 之间的间隔宽
  swatchSize = 10, // 正方形 swatch 的尺寸
  fontSize = 10,
  formatter = identity, // 文字的 formatter
  domain,
  label,
}) {
  renderer.save();
  renderer.translate(x, y);

  if (label) {
    renderer.text({
      text: label, x: 0, y: 0, fontWeight: 'bold', fontSize, textAnchor: 'start', dy: '1em',
    });
  }

  const legendY = label ? swatchSize * 2 : 0;// swatch 的左上点的 y
  for (const [i, t] of Object.entries(domain)) {
    const color = scale(t); // domin 映射成的视觉属性
    const legendX = width * i;

    renderer.rect({ // 绘制 swatch
      x: legendX,
      y: legendY,
      width: swatchSize,
      height: swatchSize,
      stroke: color,
      fill: color,
    });
    const textX = legendX + marginLeft + swatchSize;
    const textY = legendY + swatchSize;
    renderer.text({
      text: formatter(t), x: textX, y: textY, fill: 'currentColor', fontSize,
    });
  }
  renderer.restore();
}
