import { cva, cx, sva } from '@styled-system/css';
import {
  composeRenderProps,
  Tab as RACTab,
  TabList as RACTabList,
  TabListProps,
} from 'react-aria-components';

import { PanelTab } from '@/components/Sidebar/types';

import { HeaderAction } from '../header/Action';

const tabRecipe = sva({
  slots: ['tab', 'button'],
  base: {
    tab: {
      outline: 'none',
    },
  },
  variants: {
    isFocusVisible: {
      true: {
        tab: {
          _focusVisible: {
            insetFocusRing: true,
          },
        },
      },
    },
  },
});
export function Tab(props: PanelTab) {
  const { tab } = tabRecipe();
  return (
    <RACTab
      className={composeRenderProps(tab, (className, renderProps) => {
        return cx(tabRecipe(renderProps).tab, className);
      })}
      aria-label={props.title}
      id={props.id}
    >
      {({ isSelected }) => (
        <HeaderAction
          selected={isSelected}
          icon={props.icon}
          title={props.title}
          tooltipPlacement="bottom"
          onPressStart={(event) => {
            event.continuePropagation();
          }}
        />
      )}
    </RACTab>
  );
}

const tabListRecipe = cva({
  base: {
    display: 'flex',
    gap: '4',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export function TabList<T extends object>(props: TabListProps<T>) {
  return <RACTabList {...props} className={tabListRecipe()}></RACTabList>;
}
