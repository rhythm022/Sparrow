/*

    identity scale 恒等映射

    当数据实体的通道和 geometry 实体的通道希望保持一致的时候, 使用 identity scale.

    比如数据实体有一个属性是 color，而我们又希望我们图形的 fill 和 color 一致, 这个时候我们就使用 identity scale。

*/

export function createIdentity() {
  return (x) => x;
}
