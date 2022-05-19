/*
图标节点是叶子, 只有容器节点有 children 属性

type SPNode = {
  type?: string;
  data?: any[],
  transforms?: Transform[],
  encodings?: Recode<ChannelTypes, Encode>,
  statistics?: Statistic[],
  //
  scales?: Recode<ChannelTypes, Scale>,
  guides?: Recode<ChannelTypes, Guide>,
  //
  styles?: Record<string, string>
  children?: SPNode[];
  paddingLeft?: number,
  paddingRight?: number,
  paddingTop?: number,
  paddingBottom?: number,
}
*/
export { plot } from './plot';
