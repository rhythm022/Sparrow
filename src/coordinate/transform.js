export function translate(tx = 0, ty = 0) {
  return transform('translate', ([px, py]) => [px + tx, py + ty]);
}

export function scale(sx = 1, sy = 1) {
  return transform('scale', ([px, py]) => [px * sx, py * sy]);
}

function transform(type, transformer) {
  transformer.type = () => type;
  return transformer;
}

export function reflectX() {
  return transform('reflectX', scale(-1, 1));
}

export function reflectY() {
  return transform('reflectY', scale(1, -1));
}

export function transpose() { // x 的值映射到 y 通道. y 的值映射到 x 通道
  return transform('transpose', ([px, py]) => [py, px]);
}
