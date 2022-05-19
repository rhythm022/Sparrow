export function inferGuides(scales, dimensions, options) { // 补全绘制 guide 器所需的配置 // 目前实现: 只能让 x y color 通道有 guide
  const { x: xScale, y: yScale, color: colorScale } = scales;
  const { x = {}, y = {}, color = {} } = options;
  const { display: dx = true } = x; // 默认 x y color 通道有 guide
  const { display: dy = true } = y;
  const { display: dc = true } = color;

  return {
    ...(dx && xScale && { x: { ...merge(x, xScale), type: 'axisX' } }), // x y 就是 axis
    ...(dy && yScale && { y: { ...merge(y, yScale), type: 'axisY' } }),
    ...(dc && colorScale && {
      color: {
        ...merge(color, colorScale),
        ...inferPosition(dimensions),
        type: inferLegendType(colorScale), // color 就是 legend
      },
    }),
  };
}

function merge(options, { domain, label }) { // merge 进 domin 值 // guide 使用离散型 domin 值直接作为刻度比如 band 比例尺
  return { ...options, domain, label };
}

function inferLegendType({ type }) {
  switch (type) {
    case 'linear': case 'log': case 'time':
    case 'threshold': case 'quantile': case 'quantize':
      return 'legendRamp';
    default:
      return 'legendSwatches';// 当 color 通道的比例尺是离散的. 离散的居多.
  }
}

function inferPosition({ x, y, paddingLeft }) {
  return { x: x + paddingLeft, y };
}
