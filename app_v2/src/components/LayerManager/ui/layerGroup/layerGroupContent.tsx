import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import { token } from '@styled-system/tokens';

import { Heading } from '@/components/common/Typography';
import { FOOTPRINT_LAYER_NAME_SUFFIX } from '@/config/constants';

import { useLayerDisplayMode } from '../../hooks/selectors';
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
  const footprintLayer = orderedChildLayerActors.find((layer) =>
    layer.id.endsWith(FOOTPRINT_LAYER_NAME_SUFFIX),
  );

  if (!footprintLayer) {
    return null;
  }

  const otherLayers = orderedChildLayerActors.filter((layer) => layer !== footprintLayer);

  return (
    <Flex direction="column" gap="2">
      <ul>
        <LayerItem
          inGroup
          layerActor={footprintLayer as LayerMachineActor}
          key={footprintLayer.id}
        />
      </ul>
      {otherLayers.length > 0 && (
        <div>
          <Heading
            heading="body"
            as="h4"
            textPosition="end"
            style={
              {
                '--typography-bar': token('colors.fg.muted'),
              } as React.CSSProperties
            }
          >
            Active Imagery Granules
          </Heading>
          <ul>
            {otherLayers.map((layer) => (
              <LayerItem
                inGroup
                layerActor={layer as LayerMachineActor}
                key={layer.id}
                includeStatus={false}
              />
            ))}
          </ul>
        </div>
      )}
    </Flex>
  );
}

export default LayerGroupContent;
