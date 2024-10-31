import * as Accordion from '@radix-ui/react-accordion';
import { css } from '@styled-system/css';
import React from 'react';

import { useTopLevelLayers } from '../hooks/selectors';
import { LayerGroupMachineActor, LayerMachineActor } from '../machines/types';
import LayerGroupItem from './LayerGroupItem';
import { LayerItem } from './LayerItem';

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
          .map((layers) => {
            if (layers.layerActor.getSnapshot().context.layerType === 'layerGroup') {
              return (
                <LayerGroupItem
                  layerGroupActor={layers.layerActor as LayerGroupMachineActor}
                  key={layers.layerActor.id}
                />
              );
            }
            return (
              <LayerItem
                layerActor={layers.layerActor as LayerMachineActor}
                key={layers.layerActor.id}
              />
            );
          })
          .reverse()}{' '}
      </ul>
    </Accordion.Root>
  );
}

export default LayerManager;
