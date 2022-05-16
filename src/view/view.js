import { computeFlexViews } from './flex';
import { computeFacetViews } from './facet';
import { computeLayerViews } from './layer';
import { descendants, group } from '../utils';

// 支持 4 种类型的节点
export function createViews(root, computes = {
  layer: computeLayerViews,
  col: computeFlexViews,
  row: computeFlexViews,
  facet: computeFacetViews,
}) {
  const {
    width = 640, height = 480, x = 0, y = 0,
  } = root;

  // 视图 === 节点的所在区域
  const rootView = { // 根节点所在区域
    width, height, x, y,
  };

  // 根据节点索引其区域
  const nodeView = new Map([[root, rootView]]);

  // 非递归的方式确定所有节点的区域, 并登记在 nodeView
  const nodes = descendants(root);
  for (const node of nodes) { // 为当前节点的直接子节点开辟区域
    const view = nodeView.get(node);
    const { children = [], type } = node;
    const computeChildrenViews = computes[type];

    if (computeChildrenViews) { // 有 type(flex,layer,facet) 才进行
      const childrenViews = computeChildrenViews(view, node);// 根据父节点类型为直接子节点开辟区域

      if (computeChildrenViews !== computeFacetViews) { // row col layer case
        for (const [i, child] of Object.entries(children)) {
          nodeView.set(child, childrenViews[i]);// 节点个数由用户定义, createViews 为这些节点开辟区域
        }
      } else { // facet case (encodings 和 data 由用户定义, 根据这些, createViews 开辟每个分面区域)
        for (const child of children) { // 假如用户定义了两个节点, 那么每个分面区域都会有两个节点, 比如右上角关于红色三角的分面区域有两个节点
          for (const view of childrenViews) {
            nodeView.set({ ...child }, view);// 分面区域是叶子, 不能再有子区域
          }
        }
      }
    }
  }
  // 下面的逻辑只关于 nodeView
  const key = (d) => `${d.x}-${d.y}-${d.width}-${d.height}`;
  const keyViews = group(Array.from(nodeView.entries()), ([, view]) => key(view));// 相同区域的为一组, 一组为一个视图
  return Array.from(keyViews.values()).map((views) => {
    const view = views[0][1];// 视图的区域
    const nodes = views.map((d) => d[0]);// 在该区域的所有 node
    return [view, nodes];
  });
}
