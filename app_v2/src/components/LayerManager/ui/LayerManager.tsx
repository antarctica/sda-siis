import * as Accordion from '@radix-ui/react-accordion';
import { css } from '@styled-system/css';
import React from 'react';

import { useTopLevelLayers } from '../hooks/selectors';
import { LayerGroupMachineActor } from '../machines/types';
import { LayerItem } from './layer/LayerItem';
import LayerGroupItem from './layerGroup/LayerGroupItem';

function LayerManager() {
  const topLevelLayers = useTopLevelLayers();
  const openPanels = React.useMemo(
    () => topLevelLayers.map((layers) => layers.layerActor.id),
    [topLevelLayers],
  );

  return (
    <Accordion.Root type="multiple" defaultValue={openPanels}>
      <ul
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
        })}
      >
        {topLevelLayers
          .map((layer) => {
            if (layer.type === 'layerGroup') {
              return (
                <LayerGroupItem
                  layerGroupActor={layer.layerActor as LayerGroupMachineActor}
                  key={layer.layerActor.id}
                />
              );
            }
            return <LayerItem layerActor={layer.layerActor} key={layer.layerActor.id} />;
          })
          .reverse()}
      </ul>
    </Accordion.Root>
  );
}

export default LayerManager;
