import { legendSwatches } from '../../src/guide';
import { createOrdinal } from '../../src/scale';
import { createRenderer } from '../../src/renderer';
import { createDiv, mount } from '../utils';

describe('legend', () => {
  test('legendSwatches', () => {
    const domain = ['a', 'b', 'c'];
    const scale = createOrdinal({
      domain,
      range: ['#5B8FF9', '#5AD8A6', '#5D7092'],
    });
    const renderer = createRenderer(600, 400);
    mount(createDiv(), renderer.node());

    legendSwatches(renderer, scale, {}, {
      x: 0,
      y: 10,
      domain,
      label: 'name',
    });

    const svg = renderer.node();
    const [, , rect] = svg.getElementsByTagName('rect');
    expect(rect.getAttribute('x')).toBe('128');
    expect(rect.getAttribute('y')).toBe('20');
    expect(rect.getAttribute('fill')).toBe('#5D7092');
    expect(rect.getAttribute('stroke')).toBe('#5D7092');
  });
});
