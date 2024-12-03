import { createLayer } from '@/features/arcgis/util/createLayer';

import {
  LabelledGraticuleLayer as LabelledGraticuleLayerClass,
  LabelledGraticuleLayerProperties,
} from './LabelledGraticuleLayerClass';

const LabelledGraticuleLayer = createLayer<
  typeof LabelledGraticuleLayerClass,
  LabelledGraticuleLayerProperties,
  LabelledGraticuleLayerClass
>(LabelledGraticuleLayerClass);

export default LabelledGraticuleLayer;
