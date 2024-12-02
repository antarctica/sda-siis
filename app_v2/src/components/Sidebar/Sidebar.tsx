import { css, sva } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';
import React from 'react';
import { Group, Toolbar } from 'react-aria-components';
import { useLocalStorage } from 'usehooks-ts';

import Panel from '@/components/common/Panel';
import { ThemeToggler } from '@/components/Theme';

import { CollapseToggle } from './actions/CollapseToggle';
import { ShowGraticule } from './actions/ShowMapGraticule';
import { SidebarButton } from './actions/SidebarButton';
import { useSidebarActiveItem, useSidebarIsCollapsed, useSidebarItems } from './SidebarHooks';
import { SIDEBAR_COLLAPSED_KEY, SidebarContext } from './SideBarProvider';

const sidebarStyles = sva({
  slots: ['wrapper', 'buttonGroup', 'buttonGroupItem'],
  base: {
    wrapper: {
      zIndex: 1,
      height: 'full',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      bg: 'bg.sidebar',
      overflowX: 'hidden',
      flexGrow: 0,
      flexShrink: 0,
      transitionProperty: '[width, max-width]',
      transitionDuration: 'slow',
      borderRightWidth: 'thin',
      borderRightStyle: 'solid',
      borderRightColor: 'bg.base.border',
    },

    buttonGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4',
      width: 'full',
    },

    buttonGroupItem: {
      transitionProperty: '[width, max-width]',
      transitionDuration: 'slow',
    },
  },
  variants: {
    collapsed: {
      true: {
        wrapper: {
          maxWidth: '[var(--sidebar-collapsed-width, 3rem)]',
          width: '[var(--sidebar-collapsed-width, 3rem)]',
        },
        buttonGroupItem: {
          maxWidth: '[var(--sidebar-collapsed-width, 3rem)]',
          width: '[var(--sidebar-collapsed-width, 3rem)]',
        },
      },
      false: {
        wrapper: {
          maxWidth: '[var(--sidebar-expanded-width, 12rem)]',
          width: '[var(--sidebar-expanded-width, 12rem)]',
        },
        buttonGroupItem: {
          maxWidth: '[var(--sidebar-expanded-width, 12rem)]',
          width: '[var(--sidebar-expanded-width, 12rem)]',
        },
        button: {
          paddingInlineEnd: '4',
        },
      },
    },
  },
});

function Sidebar() {
  const sidebarButtonRefs = React.useRef<Record<string, HTMLButtonElement>>({});
  const isCollapsed = useSidebarIsCollapsed();
  const activeItem = useSidebarActiveItem();
  const items = useSidebarItems();
  const actorRef = SidebarContext.useActorRef();
  const [, setState] = useLocalStorage(SIDEBAR_COLLAPSED_KEY, false);
  const { wrapper, buttonGroup, buttonGroupItem } = sidebarStyles({
    collapsed: isCollapsed,
  });

  const closePanel = React.useCallback(() => {
    if (activeItem) {
      sidebarButtonRefs.current[activeItem.id]?.focus();
    }
    actorRef.send({ type: 'ITEMS.CLOSE_ALL' });
  }, [actorRef, activeItem]);

  const topItems = items.filter((item) => item.position === 'top');
  const bottomItems = items.filter((item) => item.position === 'bottom');

  return (
    <Flex
      zIndex={1}
      h={'full'}
      className={css({
        _light: {
          shadow: '2xl',
        },
      })}
    >
      <Toolbar orientation="vertical" aria-label="Map">
        <aside className={wrapper}>
          <Group aria-label="Map workflow panels">
            <nav className={buttonGroup}>
              <ul>
                {topItems.map((item) => (
                  <li key={item.id}>
                    <SidebarButton
                      ref={(ref) => (sidebarButtonRefs.current[item.id] = ref!)}
                      collapsed={isCollapsed}
                      active={item.id === activeItem?.id}
                      title={item.title}
                      icon={item.icon}
                      onPress={() => {
                        if (item.id === activeItem?.id) {
                          actorRef.send({ type: 'ITEMS.CLOSE_ALL' });
                        } else {
                          actorRef.send({ type: 'ITEMS.SET_ACTIVE', id: item.id });
                        }
                      }}
                    ></SidebarButton>
                    <Divider
                      orientation={'horizontal'}
                      thickness={'thin'}
                      color={'bg.base.border'}
                    ></Divider>
                  </li>
                ))}
              </ul>
            </nav>
          </Group>
          <Group aria-label="actions">
            <nav className={buttonGroup}>
              <ul>
                {bottomItems.map((item) => (
                  <li key={item.id} className={buttonGroupItem}>
                    <SidebarButton
                      ref={(ref) => (sidebarButtonRefs.current[item.id] = ref!)}
                      collapsed={isCollapsed}
                      active={item.id === activeItem?.id}
                      title={item.title}
                      icon={item.icon}
                      onPress={() => {
                        actorRef.send({ type: 'ITEMS.SET_ACTIVE', id: item.id });
                      }}
                    ></SidebarButton>
                    <Divider
                      orientation={'horizontal'}
                      thickness={'thin'}
                      color={'bg.base.border'}
                    ></Divider>
                  </li>
                ))}
                <li key={'theme-toggler'} className={buttonGroupItem}>
                  <ShowGraticule isCollapsed={isCollapsed}></ShowGraticule>
                  <Divider
                    orientation={'horizontal'}
                    thickness={'thin'}
                    color={'bg.base.border'}
                  ></Divider>
                  <ThemeToggler isCollapsed={isCollapsed}></ThemeToggler>
                  <Divider
                    orientation={'horizontal'}
                    thickness={'thin'}
                    color={'bg.base.border'}
                  ></Divider>
                </li>
                <li key={'collapse'} className={buttonGroupItem}>
                  <CollapseToggle
                    actorRef={actorRef}
                    isCollapsed={isCollapsed}
                    onToggle={(collapsed) => {
                      setState(collapsed);
                    }}
                  ></CollapseToggle>
                </li>
              </ul>
            </nav>
          </Group>
        </aside>{' '}
      </Toolbar>
      {activeItem && (
        <Panel
          onClose={closePanel}
          title={activeItem.title}
          tabs={activeItem.type === 'tabbed-panel' ? activeItem.tabs : undefined}
        >
          {activeItem.type === 'panel' && <activeItem.component />}
        </Panel>
      )}
    </Flex>
  );
}

export default Sidebar;
