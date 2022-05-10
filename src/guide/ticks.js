export function ticksBottom(renderer, ticks, { tickLength, fontSize }) {
  for (const { x, y, text } of ticks) {
    const x2 = x;
    const y2 = y + tickLength;
    renderer.line({
      x1: x, y1: y, x2, y2, stroke: 'currentColor', class: 'tick',
    });
    renderer.text({
      text, fontSize, x, y: y2, textAnchor: 'middle', dy: '1em', class: 'text',
    });
  }
}
