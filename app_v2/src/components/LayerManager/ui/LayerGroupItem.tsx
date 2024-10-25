import * as Accordion from '@radix-ui/react-accordion';
import { cx, sva } from '@styled-system/css';
import { Divider, VisuallyHidden } from '@styled-system/jsx';
import { token } from '@styled-system/tokens';
import { useSelector } from '@xstate/react';
import React from 'react';

import Checkbox from '@/components/common/forms/Checkbox';
import SvgIcon from '@/components/common/SvgIcon';
import Typography, { Heading } from '@/components/common/Typography';

import { LayerGroupMachineActor, LayerMachineActor } from '../machines/types';
import { LayerItem } from './LayerItem';

const accordionItemRecipe = sva({
  slots: ['root', 'header', 'trigger', 'title', 'badge', 'content', 'caret'],
  base: {
    root: {},
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      h: '12',
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
    content: {
      pr: '2',
    },
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
  const layerName = useSelector(layerGroupActor, ({ context }) => context.layerName);
  const childLayerOrder = useSelector(layerGroupActor, ({ context }) => context.childLayerOrder);
  const children = useSelector(layerGroupActor, ({ context }) => context.children);

  const [enabledChildLayerCount, setEnabledChildLayerCount] = React.useState(0);
  React.useEffect(() => {
    function countEnabledChildren() {
      return children.filter((child) =>
        (child as LayerMachineActor).getSnapshot().matches('enabled'),
      ).length;
    }

    setEnabledChildLayerCount(countEnabledChildren());

    const subscriptions = children.map((child) =>
      (child as LayerMachineActor).subscribe(() => {
        setEnabledChildLayerCount(countEnabledChildren());
      }),
    );

    return () => {
      subscriptions.forEach(({ unsubscribe }) => unsubscribe());
    };
  }, [children]);

  const enabled = useSelector(layerGroupActor, (state) => state.matches('enabled'));

  const orderedChildLayerActors = childLayerOrder.map((layerId) => {
    const childLayerActor = children.find((c) => c.id === layerId);
    return childLayerActor as LayerMachineActor;
  });

  return (
    <Accordion.Item value={layerId} className={root}>
      <div className={header}>
        <Accordion.Trigger className={cx(trigger, 'group focus-target')}>
          <SvgIcon size={16} name="icon-chevron-up" className={caret} color={token('colors.fg')} />
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
        {orderedChildLayerActors
          .map((child) => <LayerItem layerActor={child} key={child.id} />)
          .reverse()}
      </Accordion.Content>
    </Accordion.Item>
  );
}

export default LayerGroupItem;
