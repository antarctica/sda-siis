import { selectGraticuleVisible } from '@/store/features/appSlice';
import { useAppSelector } from '@/store/hooks';

import LabelledGraticuleLayer from './LabelledGraticuleLayer';
import { LabelledGraticuleLayerProperties } from './LabelledGraticuleLayerClass';

export function GraticuleLayer(props: LabelledGraticuleLayerProperties) {
  const isGraticuleVisible = useAppSelector(selectGraticuleVisible);
  return <LabelledGraticuleLayer {...props} visible={isGraticuleVisible}></LabelledGraticuleLayer>;
}
