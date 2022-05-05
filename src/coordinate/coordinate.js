import { compose } from '../utils';

export function createCoordinate({
  transforms: coordinates = [],
  ...canvasOptions
}) {
  const transforms = coordinates.flatMap((coordinate) => coordinate(canvasOptions));
  // transforms 列表元素是 已配置好可直接调用的 scale/translate 等函数
  const types = transforms.map((d) => d.type());
  const output = compose(...transforms);// 将 scale/translate 等 pipe 化, 然后暴露出去
  const {
    x, y, width, height,
  } = canvasOptions;

  output.isPolar = () => types.indexOf('polar') !== -1;
  output.isTranspose = () => types.reduce((is, type) => is ^ (type === 'transpose'), false); // 666
  output.center = () => [x + width / 2, y + height / 2];

  return output;
}
