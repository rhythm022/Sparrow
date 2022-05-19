import {
  interval, line, area, text, link, cell, rect, point, path,
} from '../geometry';
import {
  createBand,
  createIdentity,
  createLinear,
  createLog,
  createOrdinal,
  createPoint,
  createQuantile,
  createQuantize,
  createThreshold,
  createTime,
} from '../scale';
import {
  axisX, axisY, legendRamp, legendSwatches,
} from '../guide';
import { cartesian, transpose, polar } from '../coordinate';
import {
  createBinX, createNormalizeY, createSymmetryY, createStackY,
} from '../statistic';

// 接受
// transformsOptions
// chartNodes/geometries
// statisticsOptions
// coordinateOptions
// scaleDescriptors
// guidesDescriptors
export function create(options) {
  if (typeof options === 'function') return options;// transformsOptions
  const { type, ...rest } = options;

  // geometries
  if (type === 'interval') return interval;
  if (type === 'line') return line;
  if (type === 'area') return area;
  if (type === 'text') return text;
  if (type === 'link') return link;
  if (type === 'cell') return cell;
  if (type === 'rect') return rect;
  if (type === 'point') return point;
  if (type === 'path') return path;

  // facet chartNodes
  if (type === 'facet') {
    const facet = () => {};
    facet.channels = () => ({
      x: { name: 'x', optional: true },
      y: { name: 'y', optional: true },
    });
    return facet;
  }

  // statisticsOptions
  if (type === 'stackY') return createStackY(rest);
  if (type === 'normalizeY') return createNormalizeY(rest);
  if (type === 'symmetryY') return createSymmetryY(rest);
  if (type === 'binX') return createBinX(rest);

  // coordinateOptions
  if (type === 'cartesian') return cartesian(rest);// 用户可传入 cartesian 所需的 transformOptions, 否则使用默认
  if (type === 'transpose') return transpose(rest);
  if (type === 'polar') return polar(rest);

  // scaleDescriptors
  if (type === 'band') return createBand(rest);
  if (type === 'linear') return createScaleQ(createLinear, rest);
  if (type === 'time') return createScaleQ(createTime, rest);
  if (type === 'log') return createScaleQ(createLog, rest);
  if (type === 'identity') return createIdentity(rest);
  if (type === 'ordinal') return createOrdinal(rest);
  if (type === 'dot') return createPoint(rest);// dot === point
  if (type === 'quantile') return createQuantile(rest);
  if (type === 'quantize') return createQuantize(rest);
  if (type === 'threshold') return createThreshold(rest);

  // guidesDescriptors
  if (type === 'axisX') return createGuide(axisX, rest);
  if (type === 'axisY') return createGuide(axisY, rest);
  if (type === 'legendSwatches') return createGuide(legendSwatches, rest);
  if (type === 'legendRamp') return createGuide(legendRamp, rest);

  throw new Error(`Unknown node type: ${options.type}`);
}

function createGuide(guide, options) { // 666 // options 闭包
  return (renderer, scale, coordinate) => guide(renderer, scale, coordinate, options);
}

function createScaleQ(ctor, options) { // 默认 nice 一下
  const scale = ctor(options);

  const { nice = true, tickCount = 10 } = options;
  if (nice) scale.nice(tickCount);

  return scale;
}
