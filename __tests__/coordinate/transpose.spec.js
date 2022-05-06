import {
  createCoordinate, cartesian, transpose,
} from '../../src/coordinate';

describe('transpose', () => {
  test('transpose()', () => {
    const c = createCoordinate({
      width: 1,
      height: 1,
      x: 0,
      y: 0,
      transforms: [transpose(), cartesian()],
    });

    expect(c([0, 0])).toEqual([1, 0]);// 零点移到了 [1,0] 点
    expect(c([0.5, 0])).toEqual([1, 0.5]);
    expect(c([0.6, 0])).toEqual([1, 0.6]);
    expect(c([1, 0])).toEqual([1, 1]);
    //
    expect(c([0, 0.5])).toEqual([0.5, 0]);
    expect(c([0, 0.6])).toEqual([0.4, 0]);
    expect(c([0, 1])).toEqual([0, 0]);
    //
    expect(c([0.5, 1])).toEqual([0, 0.5]);
    expect(c([0.4, 1])).toEqual([0, 0.4]);
    expect(c.isPolar()).toBeFalsy();
    expect(c.isTranspose()).toBeTruthy();
  });

  test('transpose() cartesian()', () => {
    const c = createCoordinate({
      width: 200,
      height: 300,
      x: 0,
      y: 0,
      transforms: [transpose(), cartesian()],
    });

    expect(c([0.5, 1])).toEqual([0, 150]);
    expect(c([0.4, 1])).toEqual([0, 120]);
    expect(c.isPolar()).toBeFalsy();
    expect(c.isTranspose()).toBeTruthy();
  });
});
