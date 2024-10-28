import * as Accordion from '@radix-ui/react-accordion';
import { css } from '@styled-system/css';

import { useTopLevelLayers } from '../hooks/selectors';
import { LayerGroupMachineActor } from '../machines/types';
import LayerGroupItem from './LayerGroupItem';

function LayerManager() {
  const topLevelLayers = useTopLevelLayers();

  return (
    <Accordion.Root
      type="multiple"
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '2',
      })}
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
