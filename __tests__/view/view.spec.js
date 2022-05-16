import { createViews } from '../../src/view/view';
import { createRenderer } from '../../src/renderer/renderer';
import { mount, createDiv } from '../utils';

function renderViews(views, width = 640, height = 480) {
  const renderer = createRenderer(width, height);
  mount(createDiv(), renderer.node());

  return views.map(([{
    x, y, width, height,
  }]) => renderer.rect({ // view[0] 是视图位置, view[1] 是该视图位置的节点列表
    x, y, width, height, stroke: 'black', fill: 'none',
  }));
}

describe('createViews', () => {
  test('basic container', () => {
    const views = createViews({});// 没有子节点
    renderViews(views);
    console.log('basic container', views);

    expect(views.length).toBe(1);
    const [[view, [node]]] = views;
    expect(view).toEqual({
      x: 0, y: 0, width: 640, height: 480,
    });
    expect(node).toEqual({});
  });

  test('layer container', () => {
    const views = createViews({
      type: 'layer',
      children: [{}, {}], // 两个子节点以图层方式排列
    });
    renderViews(views);
    console.log('layer container', views);// 返回一个 view, 父子 node 在同一个 view

    expect(views.length).toBe(1);
    const [[view, nodes]] = views;
    expect(view).toEqual({
      x: 0, y: 0, width: 640, height: 480,
    });
    expect(nodes.length).toBe(3);
  });

  test('row container', () => {
    const views = createViews({
      type: 'row',
      children: [{}, {}], // 两个子节点以行方式排列
    });
    renderViews(views);
    console.log('row container', views);// 返回三个 view, 三个 node 在三个 view

    expect(views.length).toBe(3);

    const [, [view, [node]]] = views;
    expect(view).toEqual({
      height: 480, width: 300, x: 0, y: 0,
    });
    expect(node).toEqual({});
  });

  test('col container', () => {
    const views = createViews({
      type: 'col',
      padding: 20,
      flex: [1, 2, 1],
      children: [
        {}, {}, {}, // 三个子节点的排列方式是 col, 且间隔 20, 比例 1:2:1
      ],
    });
    renderViews(views);
    console.log('col container', views);

    expect(views.length).toBe(4);

    const [, [view, [node]]] = views;
    expect(view).toEqual({
      height: 110, width: 640, x: 0, y: 0,
    });
    expect(node).toEqual({});
  });

  test('flex container', () => {
    const views = createViews({
      type: 'row', // 1
      children: [
        {}, // 2
        { type: 'col'/* 3 */, children: [{}, {}] }, // 4 5
      ],
    });
    renderViews(views);
    console.log('flex container', views);// 5 个 view

    expect(views.length).toBe(5);
    const [, , , [view, [node]]] = views;
    expect(view).toEqual({
      height: 220, width: 300, x: 340, y: 0,
    });
    expect(node).toEqual({});
  });

  test('facet container with specified x', () => {
    const data = [
      { sex: 'male', skin: 'white' },
      { sex: 'male', skin: 'black' },
      { sex: 'female', skin: 'white' },
      { sex: 'female', skin: 'yellow' },
    ];
    const views = createViews({
      type: 'facet',
      encodings: {
        x: 'sex', // male or female 两种, x 方向排列
      },
      data,
      children: [{}],
    });
    renderViews(views);
    console.log('facet container with specified x', views);// 1 + 2 个 view

    expect(views.length).toBe(3);
    const [, [view, [node]]] = views;
    const { transform, ...rest } = view;
    expect(rest).toEqual({
      height: 375, width: 275, x: 45, y: 45,
    });
    expect(node).toEqual({});
    expect(transform(data)).toEqual([
      { sex: 'male', skin: 'white' },
      { sex: 'male', skin: 'black' },
    ]);
  });

  test('facet container with specified y', () => {
    const data = [
      { sex: 'male', skin: 'white' },
      { sex: 'male', skin: 'black' },
      { sex: 'female', skin: 'white' },
      { sex: 'female', skin: 'yellow' },
    ];
    const views = createViews({
      type: 'facet',
      encodings: {
        y: 'skin', // white or black or yellow 三种, y 方向排列
      },
      data,
      children: [{}, {}],
    });
    renderViews(views);
    console.log('facet container with specified y', views);// 1 + 3 个 view

    expect(views.length).toBe(4);
    const [, [view, [node]]] = views;
    const { transform, ...rest } = view;
    expect(rest).toEqual({
      height: 125, width: 550, x: 45, y: 45,
    });
    expect(node).toEqual({});
    expect(transform(data)).toEqual([
      { sex: 'male', skin: 'white' },
      { sex: 'female', skin: 'white' },
    ]);
  });

  test('facet container', () => {
    const data = [
      { sex: 'male', skin: 'white' },
      { sex: 'male', skin: 'black' },
      { sex: 'female', skin: 'white' },
      { sex: 'female', skin: 'yellow' },
    ];
    const views = createViews({
      type: 'facet',
      encodings: {
        x: 'sex', // 2x ✖️ 3y
        y: 'skin',
      },
      data,
      padding: 20,
      children: [{}, {}],
    });
    renderViews(views);
    console.log('facet container', views);// 1 + 6 个 view

    expect(views.length).toBe(7);
    const [, [view, [node]]] = views;
    const { transform, ...rest } = view;
    expect(rest).toEqual({
      height: 111.66666666666667, width: 265, x: 45, y: 45,
    });
    expect(node).toEqual({});
    expect(transform(data)).toEqual([
      { sex: 'male', skin: 'white' },
    ]);
  });
});
