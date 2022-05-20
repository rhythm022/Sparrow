/*

    log 化, 增强前期的权重.
    log 化, 使 domin 中靠左的值, 在 range 中的空间变大, 被突出显示.
    底数越小, 越突出.

    1% 的 domin, 产生 66.7% 的 range

    domin        [100,10000,1000000]    1%
    domin-base10 [  2,    4,      6]   50%
    domin-baseE  [4.6,  9.2,   11.5] 66.7%

*/

import { createLinear } from './linear';
import { ticks, nice, log } from '../utils';

export function createLog({ domain, base = Math.E, ...rest }) {
  const transform = (x) => log(x, base);
  let linear = createLinear({ domain: domain.map(transform), ...rest });

  const scale = (x) => linear(transform(x));
  scale.ticks = (tickCount = 5) => {
    const [min, max] = domain.map(transform);
    return ticks(min, max, tickCount).map((x) => base ** x);
  };
  scale.nice = () => {
    domain = nice(domain, {
      floor: (x) => base ** Math.floor(transform(x)),
      ceil: (x) => base ** Math.ceil(transform(x)),
    });
    linear = createLinear({ domain: domain.map(transform), ...rest });
  };

  return scale;
}
