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
      aria-label={props.title}
      id={props.id}
      className={composeRenderProps(tab, (className, renderProps) => {
        return cx(tabRecipe(renderProps).tab, className);
      })}
    >
      {({ isSelected }) => (
        <HeaderAction
          selected={isSelected}
          icon={props.icon}
          title={props.title}
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
    flexDirection: 'row',
    gap: '4',
    alignItems: 'center',
  },
});
export function TabList<T extends object>(props: TabListProps<T>) {
  return <RACTabList {...props} className={tabListRecipe()}></RACTabList>;
}
