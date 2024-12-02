import * as Accordion from '@radix-ui/react-accordion';
import { css } from '@styled-system/css';
import { Divider } from '@styled-system/jsx';
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
          gap: '2',
        })}
      >
        {topLevelLayers.reverse().map((layer, index) => {
          const item =
            layer.type === 'layerGroup' ? (
              <React.Fragment key={`${layer.layerActor.id}-wrapper`}>
                {index > 0 && <Divider color="bg.base.border" />}
                <LayerGroupItem layerGroupActor={layer.layerActor as LayerGroupMachineActor} />
              </React.Fragment>
            ) : (
              <React.Fragment key={`${layer.layerActor.id}-wrapper`}>
                {index > 0 && <Divider color="bg.base.border" />}
                <LayerItem layerActor={layer.layerActor} />
              </React.Fragment>
            );

          return item;
        })}
      </ul>
    </Accordion.Root>
  );
}

export default LayerManager;
