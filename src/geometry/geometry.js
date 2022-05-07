/*
  可以把通道理解为特征

  createGeometry 是工厂,具体 channels / render 实现在每个 geometry 里

  geometry 就是用特征让 svg 渲染出来的对象

*/

export function createGeometry(channels, render) {
  const geometry = (renderer, I, scales, values, styles, coordinate) => {
    for (const [key, { optional, scale }] of Object.entries(channels)) {
      if (!optional) {
        if (!values[key]) throw new Error(`Missing Channel: ${key}`);// values 要提供特征值
        if (scale === 'band' && (!scales[key] || !scales[key].bandWidth)) { // scales 要提供特征值所需的 scale
          throw new Error(`${key} channel needs band scale.`);
        }
      }
    }
    return render(renderer, I, scales, values, styles, coordinate);
  };

  geometry.channels = () => channels;

  return geometry;
}
