import * as Accordion from '@radix-ui/react-accordion';
import { css } from '@styled-system/css';
import React from 'react';

import { useTopLevelLayers } from '../hooks/selectors';
import { LayerData } from '../LayerManagerProvider';
import { LayerGroupMachineActor, ManagedLayer } from '../machines/types';
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
          .map((layer) => {
            if (layer.layerActor.getSnapshot().context.layerType === 'layerGroup') {
              return (
                <LayerGroupItem
                  layerGroupActor={layer.layerActor as LayerGroupMachineActor}
                  key={layer.layerActor.id}
                />
              );
            }
            return <LayerItem {...(layer as ManagedLayer<LayerData>)} key={layer.layerActor.id} />;
          })
          .reverse()}
      </ul>
    </Accordion.Root>
  );
}

export default LayerManager;
