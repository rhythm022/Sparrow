import { dist, angleBetween, sub } from '../utils';

export function line([p0, ...points]) {
  return [
    ['M', ...p0],
    ...points.map((p) => ['L', ...p]),
  ];
}

export function area(points) {
  return [
    ...line(points), // I like
    ['Z'],
  ];
}

export function sector([c, p0, p1, p2, p3]) { // 圆心 左上0 右上1 右下2 左下3
  const r = dist(c, p0);// 外径
  const r1 = dist(c, p2);// 内径
  const a = angleBetween(sub(p0, c), sub(p1, c));// 1 确实跑的角度一定比 0 大
  const l = a > Math.PI ? 1 : 0;
  const l1 = a > Math.PI ? 1 : 0;
  return [
    ['M', p0[0], p0[1]],
    ['A', r, r, 0, l, 1, p1[0], p1[1]], // (顺时钟)绘制 0 到 1 的外径弧线
    ['L', p2[0], p2[1]],
    ['A', r1, r1, 0, l1, 0, p3[0], p3[1]], // (逆时针)绘制 2 到 3 的内径弧线
    ['Z'],
  ];
}

export function ring([c, [r1, r2]]) { // 666
  const [cx, cy] = c;
  const p0 = [cx, cy - r2]; // 上侧的外径点
  const p1 = [cx, cy + r2]; // 下侧的外径点
  const p2 = [cx, cy + r1]; // 下侧的内径点
  const p3 = [cx, cy - r1]; // 上侧的内径点
  return [
    ...sector([c, p0, p1, p2, p3]),
    ...sector([c, p1, p0, p3, p2]),
  ];
}
