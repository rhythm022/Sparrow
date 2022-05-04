/*

    log10 化后,极大增强了前期的权重
    [100,10000,1000000]  1%
    [  2,    4,      6] 50%

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
