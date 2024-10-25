import * as Accordion from '@radix-ui/react-accordion';
import { css } from '@styled-system/css';
import React from 'react';

import { useTopLevelLayers } from '../hooks/selectors';
import { LayerManagerContext } from '../LayerManagerProvider';
import { LayerGroupMachineActor, LayerType } from '../machines/types';
import LayerGroupItem from './LayerGroupItem';

const initialTestLayerConfig: {
  layerId: string;
  layerName: string;
  layerType: LayerType;
  parentId: string | null;
  layer: {
    id: string;
  };
  index?: number;
}[] = [
  {
    layerId: '1',
    layerName: 'Reference Layers',
    layerType: 'layerGroup',
    parentId: null,
    layer: {
      id: '1',
    },
  },
  {
    layerId: '2',
    layerName: 'Ice Concentration',
    layerType: 'layer',
    parentId: '1',
    layer: {
      id: '2',
    },
  },
  {
    layerId: '3',
    layerName: 'S-3 Mosaiic',
    layerType: 'layer',
    parentId: '1',
    layer: {
      id: '3',
    },
  },
  {
    layerId: '4',
    layerName: 'SAR Imagery',
    layerType: 'layerGroup',
    parentId: null,
    layer: {
      id: '4',
    },
    index: 0,
  },
  {
    layerId: '5',
    layerName: 'SAR Imagery Test Group',
    layerType: 'layerGroup',
    parentId: '4',
    layer: {
      id: '5',
    },
  },
];

function LayerManager() {
  const layerManagerActor = LayerManagerContext.useActorRef();
  const topLevelLayers = useTopLevelLayers();
  React.useEffect(() => {
    initialTestLayerConfig.forEach((layerConfig) => {
      layerManagerActor.send({
        type: 'LAYER.ADD',
        layerConfig: { ...layerConfig },
        index: layerConfig.index,
      });
    });
    return () =>
      layerManagerActor.send({
        type: 'RESET',
      });
  }, [layerManagerActor]);

  return (
    <Accordion.Root
      type="single"
      collapsible
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
