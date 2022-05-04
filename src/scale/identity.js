/*

    Identity:“恒等映射”

    当希望数据的属性和视觉属性保持一致的时候，
    我们使用 Identity 比例尺，
    比如数据有一个属性是 color，而我们又希望我们图形的填充颜色和 color 保持一致，
    这个时候我们就使用 Identity 比例尺。

*/

export function createIdentity() {
  return (x) => x;
}
