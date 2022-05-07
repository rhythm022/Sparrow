/*
    createCoordinate 是工厂,具体 transforms 实现在每个 coordinate 里

    创建坐标系时, 传入 x y width height 信息

    调用坐标系时, 规定坐标系接受归一化的 [0,0] 到 [1,1] 范围的点

    坐标系用于决定样本的位置通道 x y
*/

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
