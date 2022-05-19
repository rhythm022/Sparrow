/*

createGeometry 是工厂,具体 channels / render 实现在每个 geometry 里

*/

export function createGeometry(channels, render) {
  const geometry = (renderer, I, scales, values, styles, coordinate) => { // 1. 传入的 values 的各通道已经经过比例尺的变形
    for (const [key, { optional, scale }] of Object.entries(channels)) {
      if (!optional) {
        if (!values[key]) throw new Error(`Missing Channel: ${key}`);// 必须提供实体要求的通道值
        if (scale === 'band' && (!scales[key] || !scales[key].bandWidth)) { // 2. 使用的这个比例尺必须是实体要求的比例尺, 比如 interval 实体要求 x 通道使用 band 比例尺做变形
          throw new Error(`${key} channel needs band scale.`);
        }
      }
    }
    return render(renderer, I, scales, values, styles, coordinate);
  };

  geometry.channels = () => channels;

  return geometry;
}
