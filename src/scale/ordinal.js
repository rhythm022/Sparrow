/*
    ordinal scale 是离散 domin 映射到离散 range.

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
  /* const key = JSON.stringify; */
  const indexMap = new Map(domain.map((d, i) => [/* key */(d), i]));// O(1)
  return (x) => {
    const index = indexMap.get(/* key */(x));
    return range[index % range.length];
  };
}
