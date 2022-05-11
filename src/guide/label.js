export function labelLeftDown(renderer, label, { x, y }, { isOrdinal, ...options }) {
  const text = isOrdinal ? label : `↓ ${label}`;
  renderer.text({
    ...common(options), text, x, y, dy: '2.2em',
  });
}

// 当 axis 在底部，且方向向右
export function labelBottomRight(renderer, label, { x, y }, { isOrdinal, tickLength, ...options }) {
  const ty = y + tickLength;
  const text = isOrdinal ? label : `${label} →`;
  renderer.text({
    ...common(options), text, x, y: ty, dy: '2.2em',
  });
}

function common({ fontSize }) {
  return {
    textAnchor: 'end', class: 'label', fontWeight: 'bold', fontSize,
  };
}
