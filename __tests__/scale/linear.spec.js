import { createLinear, interpolateNumber } from '../../src/scale';

function nice(domain, niceDomain, tickCount) {
  const scale = createLinear({
    domain,
    range: [0, 1],
  });
  scale.nice(tickCount);
  const [r0, r1] = niceDomain.map(scale);//  拓展后的新作用域上下限当然是映射到值域的上下限
  return r0 === 0 && r1 === 1;
}

function ticks(domain, tickCount) {
  return createLinear({ domain, range: [0, 1] }).ticks(tickCount);
}

describe('createLinear', () => {
  test('createLinear(options) returns a a linear function.', () => {
    const s = createLinear({
      domain: [0, 1],
      range: [0, 100],
    });

    expect(s(0)).toBe(0);
    expect(s(0.3)).toBe(30);
    expect(s(0.5)).toBe(50);
    expect(s(0.7)).toBe(70);
    expect(s(1)).toBe(100);
  });

  test('createLinear(options) uses custom interpolate.', () => {
    const s = createLinear({
      domain: [0, 1],
      range: ['a', 'z'],
      interpolate: (t, start, end) => {
        const charCode = interpolateNumber(// 666
          t,
          start.charCodeAt(),
          end.charCodeAt(),
        );
        return String.fromCharCode(charCode);
      },
    });

    expect(s(0)).toBe('a');
    expect(s(1)).toBe('z');
    expect(s(0.5)).toBe('m');
  });

  test('scale.nice(tickCount) extends domain for better ticks.', () => {
    expect(nice([12, 87], [0, 100], 5)).toBeTruthy();// [12, 87]是原作用域上下限, [0, 100]是新作用域上下限
    expect(nice([12, 87], [10, 90], 10)).toBeTruthy();// [10, 90]是新作用域上下限
    expect(nice([12, 87], [12, 87], 100)).toBeTruthy();// [12, 87]是新作用域上下限
  });

  test('scale.ticks() return ticks in 1, 2, 5 * 10 ^ n format', () => {
    expect(ticks([0, 1], 10)).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);// 0.1
    expect(ticks([0, 1], 9)).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);// 0.1
    expect(ticks([0, 1], 8)).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);// 0.1
    expect(ticks([0, 1], 7)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);// 0.2
    expect(ticks([0, 1], 6)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);// 0.2
    expect(ticks([0, 1], 5)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);// 0.2
    expect(ticks([0, 1], 4)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);// 0.2
    expect(ticks([0, 1], 3)).toEqual([0, 0.5, 1]);// 0.5
    expect(ticks([0, 1], 2)).toEqual([0, 0.5, 1]);// 0.5
    expect(ticks([0, 1], 1)).toEqual([0, 1]);// 1
  });
});
