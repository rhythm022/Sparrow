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

  // 视图 === 渲染的位置信息
  const rootView = { // 根节点视图
    width, height, x, y,
  };

  // 根据节点索引视图
  const nodeView = new Map([[root, rootView]]);

  // 非递归的方式确定所有节点的位置, 并存放在 nodeView
  const nodes = descendants(root);
  for (const node of nodes) { // 为当前节点的直接子节点确定位置
    const view = nodeView.get(node);
    const { children = [], type } = node;
    const computeChildrenViews = computes[type];

    if (computeChildrenViews) { // 有 type 才进行
      const childrenViews = computeChildrenViews(view, node);// 每个直接子节点的位置

      if (computeChildrenViews !== computeFacetViews) { // flex layer 视图的情况
        for (const [i, child] of Object.entries(children)) {
          nodeView.set(child, childrenViews[i]);// 节点由用户定义, createViews 为这些节点确定位置/视图
        }
      } else { // facet 视图的情况(由用户定义的 encodings 和 data, 确定位置/视图)
        for (const child of children) { // 用户定义的节点个数决定每个分面视图的节点数, 比如右上角关于红色三角的视图有两个节点
          for (const view of childrenViews) {
            nodeView.set({ ...child }, view);// 分面视图是叶子, 不能再有子视图
          }
        }
      }
    }
  }
  // 下面的逻辑只关于 nodeView
  const key = (d) => `${d.x}-${d.y}-${d.width}-${d.height}`;
  const keyViews = group(Array.from(nodeView.entries()), ([, view]) => key(view));// 相同位置的为一组, 一组为一个视图
  return Array.from(keyViews.values()).map((views) => {
    const view = views[0][1];// 视图的位置
    const nodes = views.map((d) => d[0]);// 在该位置的所有 node
    return [view, nodes];
  });
}
