/*
    guide 用于把

    transform statistic 预处理后的数据实体

    和 geometry 实体的映射关系(scale)绘制出来.

    每个通道各自有 scale, 就有各自的 guide. x y 通道有 axis guide. color 通道有 legend guide.

    axis 利用刻度表明数据实体值对应的 geometry 位置. legend 利用颜色图例表明数据实体值对应的 geometry 颜色.

    guide 需要涵盖数据实体的整个 domin.

*/

export { legendSwatches } from './legendSwatches';
export { legendRamp } from './legendRamp';
export { axisX } from './axisX';
export { axisY } from './axisY';
