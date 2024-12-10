import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import { token } from '@styled-system/tokens';
import React from 'react';

import { Title } from '@/components/common/Typography';
import { FOOTPRINT_LAYER_NAME_SUFFIX } from '@/config/constants';
import { ImageryFootprintLayer } from '@/features/siisMap/layers/ImageryFootprintLayer/ImageryFootprintLayerClass';

import { useLayerById, useLayerDisplayMode } from '../../hooks/selectors';
import { LayerGroupMachineActor, LayerMachineActor } from '../../machines/types';
import { LayerItem } from '../layer/LayerItem';

interface LayerGroupContentProps {
  layerGroupActor: LayerGroupMachineActor;
  orderedChildLayerActors: LayerMachineActor[];
}

function LayerGroupContent({ layerGroupActor, orderedChildLayerActors }: LayerGroupContentProps) {
  const displayMode = useLayerDisplayMode(layerGroupActor.id);

  // Create a reversed copy of the array in a memoized value.
  // The order of the layers is reversed because the last layer
  // in the array is the topmost layer.
  const reversedLayers = React.useMemo(
    () => [...orderedChildLayerActors].reverse(),
    [orderedChildLayerActors],
  );

  if (displayMode === 'MultipleTimeSliceCollection') {
    return <MultipleTimeSliceCollectionContent orderedChildLayerActors={orderedChildLayerActors} />;
  }

  return (
    <ul
      className={css({
        gap: '2',
        flexDirection: 'column',
        listStyle: 'none',
      })}
    >
      {reversedLayers.map((child) => (
        <LayerItem layerActor={child} key={child.id} />
      ))}
    </ul>
  );
}

function MultipleTimeSliceCollectionContent({
  orderedChildLayerActors,
}: {
  orderedChildLayerActors: LayerMachineActor[];
}) {
  const footprintLayerActor = orderedChildLayerActors.find((layer) =>
    layer.id.endsWith(FOOTPRINT_LAYER_NAME_SUFFIX),
  );

  const footprintLayer = useLayerById(footprintLayerActor?.id ?? '');

  if (!footprintLayerActor) {
    return null;
  }

  const otherLayers = orderedChildLayerActors.filter((layer) => layer !== footprintLayerActor);

  return (
    <Flex gap="2" direction="column">
      <ul>
        <LayerItem
          inGroup
          layerActor={footprintLayerActor as LayerMachineActor}
          key={footprintLayerActor.id}
        />
      </ul>
      {otherLayers.length > 0 && (
        <div>
          <Title
            as="h4"
            size="body"
            lineBarPosition="end"
            style={
              {
                '--typography-bar': token('colors.fg.muted'),
              } as React.CSSProperties
            }
          >
            Active Imagery Granules
          </Title>
          <ul>
            {otherLayers.map((layer) => (
              <LayerItem
                inGroup
                layerActor={layer as LayerMachineActor}
                key={layer.id}
                includeStatus={false}
                removeLayer={() => {
                  (footprintLayer?.layerData?.mapLayer as ImageryFootprintLayer).removeChildLayer(
                    layer.id,
                  );
                }}
              />
            ))}
          </ul>
        </div>
      )}
    </Flex>
  );
}

export default LayerGroupContent;
