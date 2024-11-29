import React from 'react';

import { useTheme } from '@/components/Theme';
import { GRATICULE_DARK_STYLE, GRATICULE_LIGHT_STYLE } from '@/config/constants';
import { selectGraticuleVisible } from '@/store/features/appSlice';
import { useAppSelector } from '@/store/hooks';

import LabelledGraticuleLayer from './LabelledGraticuleLayer';
import { LabelledGraticuleLayerProperties } from './LabelledGraticuleLayerClass';

export function GraticuleLayer(props: LabelledGraticuleLayerProperties) {
  const isGraticuleVisible = useAppSelector(selectGraticuleVisible);
  const { currentTheme } = useTheme();
  const graticuleStyle = React.useMemo(() => {
    return currentTheme === 'dark' ? GRATICULE_DARK_STYLE : GRATICULE_LIGHT_STYLE;
  }, [currentTheme]);
  return (
    <LabelledGraticuleLayer
      {...props}
      visible={isGraticuleVisible}
      graticuleStyle={graticuleStyle}
    ></LabelledGraticuleLayer>
  );
}
