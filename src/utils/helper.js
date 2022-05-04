export function round(n) { // ?? 并没有 round
  return Math.round(n * 1e12) / 1e12;
}

export function ceil(n, base) { // n 除完 base, 不满一个 base 的化整为 1
  return base * Math.ceil(n / base);
}

export function floor(n, base) { // n 除完 base, 不满一个 base 的化整为 0
  return base * Math.floor(n / base);
}

export function nice(domain, interval) {
  const [min, max] = domain;
  return [interval.floor(min), interval.ceil(max)];
}

export function normalize(value, start, stop) {
  return (value - start) / (stop - start);// 可以理解为,从 0 跑到 1 的完成率
}

export function log(n, base) {
  return Math.log(n) / Math.log(base);
}
