import * as Accordion from '@radix-ui/react-accordion';
import { css, cx, sva } from '@styled-system/css';
import { Divider, VisuallyHidden } from '@styled-system/jsx';
import { token } from '@styled-system/tokens';
import { useSelector } from '@xstate/react';

import Checkbox from '@/components/common/forms/Checkbox';
import SvgIcon from '@/components/common/SvgIcon';
import Typography, { Heading } from '@/components/common/Typography';

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
      alignItems: 'center',
      gap: '2',
      h: '8',
      '&:has(.focus-target:focus-visible)': {
        insetFocusRing: true,
      },
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      flex: '1',
      cursor: 'pointer',
      insetFocusRing: false,
    },
    title: {
      textWrap: 'nowrap',
      fontSize: 'md',
      fontWeight: 'normal',
    },
    badge: {
      h: '3',
      w: '3',
      minW: '3',
      bg: 'bg.accent.soft',
      color: 'fg.accent',
      fontWeight: 'extrabold',
      textAlign: 'center',
      rounded: 'full',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2xs',
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
        px: '2',
        py: '1',
        borderRadius: 'sm',
        bg: 'bg.surface',
      })}
    >
      <Accordion.Item value={layerId} className={root}>
        <div className={header}>
          <Accordion.Trigger className={cx(trigger, 'group focus-target')}>
            <SvgIcon
              size={16}
              name="icon-chevron-up"
              className={caret}
              color={token('colors.fg')}
            />
            <Heading as="h3" heading="heading-4" margin={false} className={title}>
              {layerName}
            </Heading>
            {enabledChildLayerCount > 0 && (
              <Typography as="span" className={badge}>
                {enabledChildLayerCount}
                <VisuallyHidden> Active layers</VisuallyHidden>
              </Typography>
            )}
            <Divider orientation="horizontal" color="bg.base.border" flex="1" />
          </Accordion.Trigger>
          {enabledChildLayerCount > 0 && (
            <Checkbox
              rounded
              isSelected={enabled}
              onChange={() => {
                layerGroupActor.send({
                  type: enabled ? 'LAYER.DISABLED' : 'LAYER.ENABLED',
                });
              }}
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
