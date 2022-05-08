export function channelStyles(index, channelValues) { // 从特征值中取 style 值
  const { stroke: S, fill: F } = channelValues;
  return {
    ...(S && { stroke: S[index] }),
    ...(F && { fill: F[index] }),
  };
}

export function groupChannelStyles([index], channels) { // 获取组的第一个点的样式作为组(该条线)的样式
  return channelStyles(index, channels);
}
