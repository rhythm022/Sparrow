import { area as pathArea, line as pathLine } from './d';

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
