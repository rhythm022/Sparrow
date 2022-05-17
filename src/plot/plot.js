/*
  Sparrow 整个的渲染流程主要分为下面几个阶段：

    预处理：
      视图节点继承祖先容器节点的属性，同时合并同一区域的属性。

    获取通道值：
      data 通过 transforms 预处理。
      通过 encodings 获得通道值。
      通道值通过 statsitcs 被调整。

    创建比例尺：根据通道值以及 scales 决定选取哪种比例尺，算出定义域和值域的值。
    创建辅助组件：根据比例尺以及 guides 去创建辅助元素。

    创建坐标系：根据 coordinates 去创建坐标系。
    绘制：
      绘制几何元素。
      绘制辅助组件。
*/

import { createViews } from '../view';
import { createRenderer } from '../renderer';
import { createCoordinate } from '../coordinate';
import { create } from './create';
import { inferScales, applyScales } from './scale';
import { initialize } from './geometry';
import { inferGuides } from './guide';
import {
  bfs, identity, map, assignDefined,
} from '../utils';

export function plot(root) {
  const { width = 640, height = 480, renderer: plugin } = root;
  const renderer = createRenderer(width, height, plugin);

  flow(root);// 所有的配置项下沉到叶子图表节点

  const views = createViews(root);
  for (const [view, nodes] of views) {
    const { transform = identity, ...dimensions } = view;// 只有 facet view 才自带 transform
    const geometries = [];
    const scales = {};
    const guides = {};
    let coordinates = [];
    const chartNodes = nodes.filter(({ type }) => isChartNode(type));

    for (const options of chartNodes) { // 分离出区域配置和 chartNodes/geometry 配置 // 只有 layer facet 会出现一个区域多 geometry 的可能
      const {
        scales: s = {},
        guides: g = {},
        coordinates: c = [],
        transforms = [],
        paddingLeft, paddingRight, paddingBottom, paddingTop,
        ...geometry
      } = options;
      assignDefined(dimensions, {
        paddingLeft, paddingRight, paddingBottom, paddingTop,
      });
      assignDefined(scales, s);
      assignDefined(guides, g);
      if (c) coordinates = c;

      geometries.push({ ...geometry, transforms: [transform, ...transforms] });// geometry 配置(type,encodings,data,transforms,statistics,styles)
    }
    plotView({
      // 绘制区域
      // scales guides coordinates dimensions(x,y,width,height,paddingLeft, paddingRight, paddingBottom, paddingTop) 属于区域级别配置
      ...dimensions,
      scales,
      guides,
      coordinates,
      renderer,
      geometries,
    });
  }
  return renderer.node();// 返回 SVG 元素
}

function plotView({
  renderer,
  scales: scalesOptions,
  guides: guidesOptions,
  coordinates: coordinateOptions,
  geometries: geometriesOptions,
  width, height, x, y,
  paddingLeft = 45, paddingRight = 45, paddingBottom = 45, paddingTop = 65,
}) {
  // 区域的 geometry
  const geometries = geometriesOptions.map(initialize);

  const channels = geometries.map((d) => d.channels);
  // scales
  const scaleDescriptors = inferScales(channels, scalesOptions);
  const scales = map(scaleDescriptors, create);
  // guides
  const guidesDescriptors = inferGuides(scaleDescriptors, { x, y, paddingLeft }, guidesOptions);
  const guides = map(guidesDescriptors, create);
  // coordinate
  const transforms = inferCoordinates(coordinateOptions).map(create);
  const coordinate = createCoordinate({
    x: x + paddingLeft,
    y: y + paddingTop,
    width: width - paddingLeft - paddingRight,
    height: height - paddingTop - paddingBottom,
    transforms,
  });

  // 绘制
  // 绘制辅助组件
  for (const [key, guide] of Object.entries(guides)) {
    const scale = scales[key];
    guide(renderer, scale, coordinate);
  }
  // 绘制几何元素
  for (const {
    index, geometry, channels, styles,
  } of geometries) {
    const values = applyScales(channels, scales);
    geometry(renderer, index, scales, values, styles, coordinate);
  }
}

function isChartNode(type) {
  switch (type) {
    case 'layer': case 'col': case 'row': return false;// 容器节点
    default:
      return true;// 图表节点 === chartNode
  }
}

function flow(root) { // 666 // 给容器节点里的直接子节点填充父节点属性 => 叶子填充上祖先节点属性
  bfs(root, ({ type, children, ...options }) => {
    if (isChartNode(type)) return;
    if (!children || children.length === 0) return;
    const keyDescriptors = [
      'o:encodings', 'o:scales', 'o:guides', 'o:styles', // o === object
      'a:coordinates', 'a:statistics', 'a:transforms', 'a:data', // a === array
    ];
    for (const child of children) {
      for (const descriptor of keyDescriptors) {
        const [type, key] = descriptor.split(':');
        if (type === 'o') {
          child[key] = { ...options[key], ...child[key] };
        } else {
          child[key] = child[key] || options[key];
        }
      }
    }
  });
}

function inferCoordinates(coordinates) {
  return [...coordinates, { type: 'cartesian' }];
}
