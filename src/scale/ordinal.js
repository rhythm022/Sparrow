/*
    Ordinal 比例尺的定义域和值域都是序数属性.

    Ordinal 用于将序数属性映射为序数属性，比如下面我们将水果名字映射为颜色。

    const scale = createOrdinal({
        domain: ["苹果", "香蕉", "梨", "西瓜"],
        range: ['red', 'yellow', 'green'],
    });

    scale("苹果"); // 'red'
    scale("香蕉"); // 'yellow'
    scale("梨"); // 'green'
    scale("西瓜"); // 'red'

*/

export function createOrdinal({ domain, range }) {
//   const key = JSON.stringify;
  const indexMap = new Map(domain.map((d, i) => [/* key */(d), i]));// O(1)
  return (x) => {
    const index = indexMap.get(/* key */(x));
    return range[index % range.length];
  };
}
