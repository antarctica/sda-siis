/* eslint-disable @pandacss/no-hardcoded-color */
import { ArcgisScaleBar } from '@arcgis/map-components-react';
import { cva } from '@styled-system/css';

const scaleControlStyleOverride = cva({
  base: {
    '& .esri-scale-bar__label': {
      color: 'scaleBar !important',
    },
    '& .esri-scale-bar__line--top': {
      borderBottomColor: 'scaleBar !important',

      _before: {
        borderColor: 'scaleBar !important',
      },
      _after: {
        borderColor: 'scaleBar !important',
      },
    },

    '& .esri-scale-bar__line--bottom': {
      borderTopColor: 'scaleBar !important',

      _before: {
        borderColor: 'scaleBar !important',
      },
      _after: {
        borderColor: 'scaleBar !important',
      },
    },
    '& .esri-scale-bar__line': {
      bg: 'siis_greyAlpha.a3 !important',
      _dark: {
        bg: 'siis_greyAlpha.a8 !important',
      },
    },
  },
});

function ScaleControl() {
  return (
    <div className={scaleControlStyleOverride()}>
      <ArcgisScaleBar unit="dual" />
    </div>
  );
}

export default ScaleControl;
