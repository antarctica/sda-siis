import * as Accordion from '@radix-ui/react-accordion';
import { cx, sva } from '@styled-system/css';
import { VisuallyHidden } from '@styled-system/jsx';
import { token } from '@styled-system/tokens';
import React, { ComponentProps } from 'react';

import Checkbox from '@/components/common/forms/Checkbox';
import SvgIcon from '@/components/common/SvgIcon';
import Typography from '@/components/common/Typography';

const accordionItemRecipe = sva({
  slots: ['root', 'header', 'trigger', 'title', 'badge', 'content', 'caret'],
  base: {
    root: {},
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      flex: '1',
      cursor: 'pointer',
    },
    title: {},
    badge: {
      ml: '1',
      h: '3',
      w: '3',
      bg: 'app.white',
      color: 'fg.accent',
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

export interface IAccordionItem {
  label: string;
  id: string;
  expanded?: boolean;
  activeLayersNumber: number;
  groupToggle: boolean;
  groupToggleProps?: ComponentProps<typeof Checkbox>;
}

function AccordionItem({
  id,
  label,
  groupToggle = false,
  groupToggleProps,
  activeLayersNumber,
  children,
}: React.PropsWithChildren<IAccordionItem>) {
  const { root, header, trigger, title, badge, content, caret } = accordionItemRecipe();
  return (
    <Accordion.Item value={id} className={root}>
      <div className={header}>
        <Accordion.Trigger className={cx(trigger, 'group')}>
          <SvgIcon name="icon-chevron-up" className={caret} color={token('colors.fg')} />
          <Typography className={title}>{label}</Typography>
          {activeLayersNumber > 0 && (
            <Typography className={badge}>
              {activeLayersNumber}
              <VisuallyHidden> Active layers</VisuallyHidden>
            </Typography>
          )}
        </Accordion.Trigger>
        {groupToggle && <Checkbox {...groupToggleProps} />}
      </div>
      <Accordion.Content className={content}>{children}</Accordion.Content>
    </Accordion.Item>
  );
}

export default AccordionItem;
