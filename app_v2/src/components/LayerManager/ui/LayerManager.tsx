import * as Accordion from '@radix-ui/react-accordion';
import React from 'react';

import { useTopLevelLayers } from '../hooks/selectors';
import { LayerManagerContext } from '../LayerManagerProvider';
import { LayerGroupMachineActor, LayerType } from '../machines/types';
import LayerGroupAccordionItem from './LayerGroupAccordionItem';

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
    index: 1,
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
    <Accordion.Root type="single" collapsible>
      {topLevelLayers.map((layers) => {
        const snapshot = (layers.layerActor as LayerGroupMachineActor).getSnapshot();
        return (
          <LayerGroupAccordionItem
            label={snapshot.context.layerName}
            id={snapshot.context.layerId}
            activeLayersNumber={3}
            groupToggle={true}
            groupToggleProps={{
              rounded: true,
            }}
            key={snapshot.context.layerId}
          >
            Hello World
          </LayerGroupAccordionItem>
        );
      })}
    </Accordion.Root>
  );
}

export default LayerManager;
