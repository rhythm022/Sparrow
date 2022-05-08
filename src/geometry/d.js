export function line([p0, ...points]) {
  return [
    ['M', ...p0],
    ...points.map((p) => ['L', ...p]),
  ];
}
