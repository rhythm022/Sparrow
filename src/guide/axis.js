import { identity, lastOf } from '../utils';

export function createAxis(components) { // axis guide 就是画 ticks
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
    // axis guide 刻度 values === scale 提供的刻度 | 离散 domin 列表
    const values = isQuantitative ? scale.ticks(tickCount) : domain;
    const offset = isOrdinal ? scale.bandWidth() / 2 : 0;

    const center = coordinate.center();
    const type = `${+coordinate.isPolar()}${+coordinate.isTranspose()}`;
    const options = {
      tickLength, fontSize, center, isOrdinal,
    };

    const { // geometry 与 axis 独立绘制, axis 包括刻度ticks/label/格子grid
      grid: Grid, ticks: Ticks, label: Label, start, end,
    } = components[type];
    const ticks = values.map((d) => { // d: domin
      const [x, y] = coordinate(start(d, scale, offset));// 刻度的绘制位置 [ x, y ] === [coordinate(scale(d)), coordinate(1)]
      const text = formatter(d);
      return { x, y, text };
    });
    const labelTick = (() => { // label 的绘制位置
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
