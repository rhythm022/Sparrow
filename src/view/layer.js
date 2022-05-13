export function computeLayerViews(box, node) { // 把自己的 x y width height 作为孩子节点的区域就好
  const { children = [] } = node;
  return new Array(children.length).fill(0).map(() => ({ ...box }));
}
