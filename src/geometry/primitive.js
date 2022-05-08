import { area as pathArea, line as pathLine, ring as pathRing } from './d';

export function contour(renderer, { points, ...styles }) {
  const end = points.length;
  const mid = end / 2;
  // 绘制区域即 contour
  const contour = renderer.path({ d: pathArea(points), ...styles, stroke: 'none' });
  // 绘制这个区域的外轮廓
  const outerStroke = renderer.path({ d: pathLine(points.slice(0, mid)), ...styles, fill: 'none' });
  // 绘制这个区域的内轮廓(用点画线)
  const innerStroke = renderer.path({ d: pathLine(points.slice(mid, end)), ...styles, fill: 'none' });

  return [innerStroke, contour, outerStroke];
}

export function ring(renderer, {
  cx, cy, r1, r2, ...styles
}) {
  const ring = renderer.path({ ...styles, d: pathRing([[cx, cy], [r1, r2]]), stroke: 'none' }); // stroke none 所以看不到中线(试试 black)
  const innerStroke = renderer.circle({ // 内轮廓
    ...styles, fill: 'none', r: r1, cx, cy,
  });
  const outerStroke = renderer.circle({ // 外轮廓
    ...styles, fill: 'none', r: r2, cx, cy,
  });
  return [innerStroke, ring, outerStroke];
}
