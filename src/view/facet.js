import { group } from '../utils';

export function computeFacetViews(box, {
  data, encodings = {}, padding = 0, // 间隙 padding
  paddingLeft = 45, paddingRight = 45, paddingBottom = 45, paddingTop = 60, // 边框 padding
}) {
  const { x, y } = encodings;
  const cols = x ? Array.from(group(data, (d) => d[x]).keys()) : [undefined];// 假如 x === 'color', cols 就是各种颜色的列表
  const rows = y ? Array.from(group(data, (d) => d[y]).keys()) : [undefined];
  const n = cols.length;// 颜色个数
  const m = rows.length;// 比如形状个数
  const views = [];
  const width = box.width - paddingLeft - paddingRight;
  const height = box.height - paddingTop - paddingBottom;
  const boxWidth = (width - padding * (n - 1)) / n;
  const boxHeight = (height - padding * (m - 1)) / m;

  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < m; j += 1) {
      const transform = (data) => {
        const inRow = (d) => d[x] === cols[i] || cols[i] === undefined;
        const inCol = (d) => d[y] === rows[j] || rows[j] === undefined;
        return data.filter((d) => inRow(d) && inCol(d));
      };

      views.push({ // 比如某视图是关于红色三角
        x: box.x + paddingLeft + (boxWidth + padding) * i,
        y: box.y + paddingRight + (boxHeight + padding) * j,
        width: boxWidth,
        height: boxHeight,
        transform, // 用户可以调用该视图的 transform 函数, 得到红色三角的实体列表
      });
    }
  }
  return views;
}
