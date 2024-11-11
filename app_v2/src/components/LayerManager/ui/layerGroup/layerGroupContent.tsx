import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';

import { Heading } from '@/components/common/Typography';

import { useLayerDisplayMode } from '../../hooks/selectors';
import { LayerManagerContext } from '../../LayerManagerProvider';
import { LayerGroupMachineActor, LayerMachineActor } from '../../machines/types';
import { LayerItem } from '../layer/LayerItem';

interface LayerGroupContentProps {
  layerGroupActor: LayerGroupMachineActor;
  orderedChildLayerActors: LayerMachineActor[];
}

function LayerGroupContent({ layerGroupActor, orderedChildLayerActors }: LayerGroupContentProps) {
  const displayMode = useLayerDisplayMode(layerGroupActor.id);

  if (displayMode === 'MultipleTimeSliceCollection') {
    return <MultipleTimeSliceCollectionContent orderedChildLayerActors={orderedChildLayerActors} />;
  }

  return (
    <ul
      className={css({
        listStyle: 'none',
        flexDirection: 'column',
        gap: '2',
      })}
    >
      {orderedChildLayerActors
        .map((child) => <LayerItem layerActor={child} key={child.id} />)
        .reverse()}
    </ul>
  );
}

function MultipleTimeSliceCollectionContent({
  orderedChildLayerActors,
}: {
  orderedChildLayerActors: LayerMachineActor[];
}) {
  // get all of the layers for the current child layer actors
  const layers = LayerManagerContext.useSelector(({ context }) => {
    const layerIds = orderedChildLayerActors.map((layer) => layer.id);
    return context.layers.filter((layer) => layerIds.includes(layer.layerActor.id));
  });

  const footprintLayer = layers.find((layer) => layer.layerData?.mapLayer instanceof FeatureLayer);
  if (!footprintLayer) {
    return null;
  }
  const otherLayers = layers.filter((layer) => layer !== footprintLayer);

  return (
    <Flex direction="column" gap="2">
      <div>
        <Heading heading="heading-3" as="h3">
          Time Slices
        </Heading>
        <ul>
          {otherLayers.map((layer) => (
            <LayerItem
              layerActor={layer.layerActor as LayerMachineActor}
              key={layer.layerActor.id}
              includeStatus={false}
            />
          ))}
        </ul>
      </div>
      <div>
        <Heading heading="heading-3" as="h3">
          Footprints
        </Heading>

        <ul>
          <LayerItem
            layerActor={footprintLayer.layerActor as LayerMachineActor}
            key={footprintLayer.layerActor.id}
          />
        </ul>
      </div>
    </Flex>
  );
}

export default LayerGroupContent;
