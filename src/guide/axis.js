import { identity, lastOf } from '../utils';

export function createAxis(components) {
  return (
    renderer,
    scale,
    coordinate,
    {
      domain,
      label,
      tickCount = 10,
      formatter = identity,
      tickLength = 5,
      grid = false,
      tick = true,
    },
  ) => {
    if (domain.length === 0) return;
    const fontSize = 10;
    const isOrdinal = !!scale.bandWidth;
    const isQuantitative = !!scale.ticks;
    // 连续比例尺的 values === domin 的 刻度 (linear/log/time)
    // 离散比例尺的 values == domin + offset (ordianl/band/point)
    const values = isQuantitative ? scale.ticks(tickCount) : domain;
    const offset = isOrdinal ? scale.bandWidth() / 2 : 0;

    const center = coordinate.center();
    const type = `${+coordinate.isPolar()}${+coordinate.isTranspose()}`;
    const options = {
      tickLength, fontSize, center, isOrdinal,
    };

    const { // 什么样的坐标系渲染什么样的坐标轴, 坐标轴包括 grid / ticks / label
      grid: Grid, ticks: Ticks, label: Label, start, end,
    } = components[type];
    const ticks = values.map((d) => { // d === scale 的 domin 值
      const [x, y] = coordinate(start(d, scale, offset));// 坐标轴上刻度的绘制位置 [ x, y ] === [coordinate(scale(d)), coordinate(1)]
      const text = formatter(d);
      return { x, y, text };
    });
    const labelTick = (() => { // 坐标轴上 label 的绘制位置
      if (!isOrdinal) return lastOf(ticks);
      const value = lastOf(values);
      const [x, y] = coordinate(start(value, scale, offset * 2));
      return { x, y };
    })();

    if (grid && Grid) Grid(renderer, ticks, end(coordinate));
    if (tick && Ticks) Ticks(renderer, ticks, options);
    if (label && Label) Label(renderer, label, labelTick, options);
  };
}
