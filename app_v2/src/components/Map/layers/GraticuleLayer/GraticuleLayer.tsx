import { createLayer } from '@/arcgis/util/createLayer';

import {
  GraticuleLayer as GraticuleLayerClass,
  GraticuleLayerProperties,
} from './GraticuleLayerClass';

const GraticuleLayer = createLayer<
  typeof GraticuleLayerClass,
  GraticuleLayerProperties,
  GraticuleLayerClass
>(GraticuleLayerClass);

export default GraticuleLayer;
