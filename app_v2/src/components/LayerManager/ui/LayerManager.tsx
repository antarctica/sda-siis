import * as Accordion from '@radix-ui/react-accordion';
import { css } from '@styled-system/css';
import React from 'react';

import { useTopLevelLayers } from '../hooks/selectors';
import { LayerGroupMachineActor } from '../machines/types';
import LayerGroupItem from './LayerGroupItem';

function LayerManager() {
  const topLevelLayers = useTopLevelLayers();
  const defaultValue = React.useMemo(
    () => topLevelLayers.map((layers) => layers.layerActor.id),
    [topLevelLayers],
  );

  return (
    <Accordion.Root
      type="multiple"
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '2',
      })}
      defaultValue={defaultValue}
    >
      {topLevelLayers
        .map((layers) => {
          return (
            <LayerGroupItem
              layerGroupActor={layers.layerActor as LayerGroupMachineActor}
              key={layers.layerActor.id}
            />
          );
        })
        .reverse()}
    </Accordion.Root>
  );
}

export default LayerManager;
