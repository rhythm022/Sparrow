import { line as pathLine, area as pathArea, sector as pathSector } from './d';
import { contour, ring } from './primitive';
import { dist, sub, equal } from '../utils';

export function circle(renderer, coordinate, {
  cx, cy, r, ...styles
}) {
  const [px, py] = coordinate([cx, cy]);
  return renderer.circle({
    cx: px, cy: py, r, ...styles, // cx cy r 等是 svg 的要求
  });
}

export function text(renderer, coordinate, {
  x, y, rotate, text, ...styles
}) {
  const [px, py] = coordinate([x, y]);
  renderer.save();
  renderer.translate(px, py);
  renderer.rotate(rotate);
  const textElement = renderer.text({
    text, x: 0, y: 0, ...styles,
  });
  renderer.restore();
  return textElement;
}

export function link(renderer, coordinate, {
  x1, y1, x2, y2, ...styles
}) {
  const [p0, p1] = [[x1, y1], [x2, y2]].map(coordinate);
  return renderer.line({
    x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], ...styles,
  });
}

export function line(renderer, coordinate, {
  X, Y, I: I0, ...styles
}) {
  const I = coordinate.isPolar() ? [...I0, I0[0]] : I0; // 极坐标系下这条线需要闭合
  const points = I.map((i) => coordinate([X[i], Y[i]]));
  const d = pathLine(points);
  return renderer.path({ d, ...styles });
}

export function area(renderer, coordinate, {
  X1, Y1, X2, Y2, I: I0, ...styles
}) {
  const I = coordinate.isPolar() ? [...I0, I0[0]] : I0;
  const points = [
    ...I.map((i) => [X1[i], Y1[i]]),
    ...I.map((i) => [X2[i], Y2[i]]).reverse(), // reverse 为了顺时针绘图
  ].map(coordinate);

  if (coordinate.isPolar()) {
    return contour(renderer, { points, ...styles });
  }
  return renderer.path({ d: pathArea(points), ...styles });
}

export function rect(renderer, coordinate, {
  x1, y1, x2, y2, ...styles
}) {
  const v0 = [x1, y1];// 传统意义的左上   [ 0.5, 0.5 ]
  const v1 = [x2, y1];// 传统意义的右上   [   1, 0.5 ]
  const v2 = [x2, y2];// 传统意义的右下   [   1,   1 ]
  const v3 = [x1, y2];// 传统意义的左下   [ 0.5,   1 ]

  const vs = coordinate.isTranspose() ? [v3, v0, v1, v2] : [v0, v1, v2, v3];
  const ps = vs.map(coordinate);
  const [p0, p1, p2, p3] = ps;

  // 绘制矩形
  if (!coordinate.isPolar()) {
    const [width, height] = sub(p2, p0);// 左上 减 右下
    const [x, y] = p0;
    return renderer.rect({
      x, y, width, height, ...styles,
    });
  }

  const center = coordinate.center();
  const [cx, cy] = center;
  // 绘制扇形
  if (!(equal(p0, p1) && equal(p2, p3))) {
    return renderer.path({ d: pathSector([center, ...ps]), ...styles });
  }
  // 绘制整圆
  const r1 = dist(center, p2);
  const r2 = dist(center, p0);
  return ring(renderer, {
    cx, cy, r1, r2, ...styles,
  });
}

export function path(renderer, coordinate, attributes) {
  return renderer.path(attributes);
}
