import { ArcgisLegend } from '@arcgis/map-components-react';

import { MAP_ID } from '@/config/constants';

export function Legend() {
  return (
    <div>
      <ArcgisLegend referenceElement={MAP_ID} />
    </div>
  );
}
