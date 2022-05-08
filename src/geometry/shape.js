import { line as pathLine } from './d';

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
