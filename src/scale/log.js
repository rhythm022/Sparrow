/*

    log 化后,极大增强了前期的权重

    底数越小,前期权重越大

    用于表现 1% 的努力,产生了 66.7% 的成果的场景

          [100,10000,1000000]    1%
    base10[  2,    4,      6]   50%
    baseE [4.6,  9.2,   11.5] 66.7%

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
