export function channelStyles(index, channelValues) { // 从特征值中取 style 值
  const { stroke: S, fill: F } = channelValues;
  return {
    ...(S && { stroke: S[index] }),
    ...(F && { fill: F[index] }),
  };
}
