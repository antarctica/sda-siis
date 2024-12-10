import * as Accordion from '@radix-ui/react-accordion';
import { css, cx, sva } from '@styled-system/css';
import { Divider, VisuallyHidden } from '@styled-system/jsx';
import { token } from '@styled-system/tokens';
import { useSelector } from '@xstate/react';

import Checkbox from '@/components/common/forms/Checkbox';
import SvgIcon from '@/components/common/SvgIcon';
import { Text, Title } from '@/components/common/Typography';

import { useLayerGroupLayers } from '../../hooks/selectors';
import { useEnabledChildCount } from '../../hooks/useEnabledChildCount';
import { LayerGroupMachineActor, LayerMachineActor } from '../../machines/types';
import LayerGroupContent from './layerGroupContent';

const accordionItemRecipe = sva({
  slots: ['root', 'header', 'trigger', 'title', 'badge', 'content', 'caret'],
  base: {
    root: {},
    header: {
      display: 'flex',
      gap: '2',
      alignItems: 'center',
      h: '8',
      '&:has(.focus-target:focus-visible)': {
        insetFocusRing: true,
      },
    },
    trigger: {
      display: 'flex',
      flex: '1',
      gap: '2',
      alignItems: 'center',
      cursor: 'pointer',
      insetFocusRing: false,
    },
    title: {
      textWrap: 'nowrap',
      fontSize: 'md',
      fontWeight: 'normal',
    },
    badge: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      rounded: 'full',
      w: '3',
      minW: '3',
      h: '3',
      color: 'fg.accent',
      textAlign: 'center',
      fontSize: '2xs',
      fontWeight: 'extrabold',
      bg: 'bg.accent.soft',
    },
    content: {},

    caret: {
      _groupExpanded: {
        transform: 'rotate(180deg)',
      },
    },
  },
});

function LayerGroupItem({ layerGroupActor }: { layerGroupActor: LayerGroupMachineActor }) {
  const { root, header, trigger, title, badge, content, caret } = accordionItemRecipe();
  const layerId = layerGroupActor.id;
  const { layerName } = useSelector(layerGroupActor, ({ context }) => ({
    layerName: context.layerName,
  }));
  const orderedChildLayerActors = useLayerGroupLayers(layerGroupActor) as LayerMachineActor[];

  const enabledChildLayerCount = useEnabledChildCount(orderedChildLayerActors);

  const enabled = useSelector(layerGroupActor, (state) => state.matches('enabled'));

  return (
    <li
      className={css({
        borderRadius: 'sm',
        py: '1',
        px: '2',
        bg: 'bg.surface',
      })}
    >
      <Accordion.Item className={root} value={layerId}>
        <div className={header}>
          <Accordion.Trigger className={cx(trigger, 'group focus-target')}>
            <SvgIcon
              className={caret}
              size={16}
              name="icon-chevron-up"
              color={token('colors.fg')}
            />
            <Title as="h3" className={title} size="md" margin={false}>
              {layerName}
            </Title>
            {enabledChildLayerCount > 0 && (
              <Text as="span" className={badge}>
                {enabledChildLayerCount}
                <VisuallyHidden> Active layers</VisuallyHidden>
              </Text>
            )}
            <Divider orientation="horizontal" flex="1" color="bg.base.border" />
          </Accordion.Trigger>
          {enabledChildLayerCount > 0 && (
            <Checkbox
              isSelected={enabled}
              onChange={() => {
                layerGroupActor.send({
                  type: enabled ? 'LAYER.DISABLED' : 'LAYER.ENABLED',
                });
              }}
              rounded
            />
          )}
        </div>
        <Accordion.Content className={content}>
          <LayerGroupContent
            layerGroupActor={layerGroupActor}
            orderedChildLayerActors={orderedChildLayerActors}
          />
        </Accordion.Content>
      </Accordion.Item>
    </li>
  );
}

export default LayerGroupItem;
