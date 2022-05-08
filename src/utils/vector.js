export function equal([x0, y0], [x1, y1]) {
  return closeTo(x0, x1) && closeTo(y0, y1);
}

export function closeTo(x, y, tol = 1e-5) {
  return Math.abs(x - y) < tol;
}

export function dist([x0, y0], [x1 = 0, y1 = 0] = []) {
  return Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2);
}

export function sub([x1, y1], [x0, y0]) {
  return [x1 - x0, y1 - y0];
}

/*
    v1 v0 都从 x 轴出发逆时针转动

    假设 v1 永远在 v0 前面 ??

    返回值: v1 往回转多少角度能遇到 v0
*/
export function angleBetween(v0, v1) {
  const a0 = angle(v0);
  const a1 = angle(v1);
  if (a0 < a1) return a1 - a0;
  return Math.PI * 2 + (a1 - a0);
}

export function angle([x, y]) {
  const theta = Math.atan2(y, x);// remember
  return theta;
}
