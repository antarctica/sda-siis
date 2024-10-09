import { sva } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';
import { useLocalStorage } from 'usehooks-ts';

import Panel from '../Panel';
import { ThemeToggler } from '../Theme';
import { CollapseToggle } from './actions/CollapseToggle';
import { SidebarButton } from './actions/SidebarButton';
import { useSidebarActiveItem, useSidebarIsCollapsed, useSidebarItems } from './SidebarHooks';
import { SIDEBAR_COLLAPSED_KEY, SidebarContext } from './SideBarProvider';

const sidebarStyles = sva({
  slots: ['wrapper', 'buttonGroup', 'buttonGroupItem'],
  base: {
    wrapper: {
      height: 'full',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      bg: 'bg.base',
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
      borderTopWidth: 'thin',
      borderStyle: 'solid',
      borderColor: 'bg.base.border',
      _last: {
        borderBottomWidth: 'thin',
      },

      transitionProperty: '[width, max-width]',
      transitionDuration: 'slow',
    },
  },
  variants: {
    collapsed: {
      true: {
        wrapper: {
          maxWidth: '[var(--sidebar-collapsed-width, 48px)]',
          width: '[var(--sidebar-collapsed-width, 48px)]',
        },
        buttonGroupItem: {
          maxWidth: '[var(--sidebar-collapsed-width, 48px)]',
          width: '[var(--sidebar-collapsed-width, 48px)]',
        },
      },
      false: {
        wrapper: {
          maxWidth: '[var(--sidebar-expanded-width, 200px)]',
          width: '[var(--sidebar-expanded-width, 200px)]',
        },
        buttonGroupItem: {
          maxWidth: '[var(--sidebar-expanded-width, 200px)]',
          width: '[var(--sidebar-expanded-width, 200px)]',
        },
        button: {
          paddingInlineEnd: '4',
        },
      },
    },
  },
});

function Sidebar() {
  const isCollapsed = useSidebarIsCollapsed();
  const activeItem = useSidebarActiveItem();
  const items = useSidebarItems();
  const actorRef = SidebarContext.useActorRef();
  const [, setState] = useLocalStorage(SIDEBAR_COLLAPSED_KEY, false);
  const { wrapper, buttonGroup, buttonGroupItem } = sidebarStyles({
    collapsed: isCollapsed,
  });

  const Component = activeItem?.component;
  const topItems = items.filter((item) => item.position === 'top');
  const bottomItems = items.filter((item) => item.position === 'bottom');

  return (
    <Flex zIndex={1}>
      <aside className={wrapper}>
        <nav className={buttonGroup}>
          <ul>
            {topItems.map((item) => (
              <li key={item.id} className={buttonGroupItem}>
                <SidebarButton
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
              </li>
            ))}
          </ul>
        </nav>
        <nav className={buttonGroup}>
          <ul>
            {bottomItems.map((item) => (
              <li key={item.id} className={buttonGroupItem}>
                <SidebarButton
                  collapsed={isCollapsed}
                  active={item.id === activeItem?.id}
                  title={item.title}
                  icon={item.icon}
                  onPress={() => {
                    actorRef.send({ type: 'ITEMS.SET_ACTIVE', id: item.id });
                  }}
                ></SidebarButton>
              </li>
            ))}
            <li key={'theme-toggler'} className={buttonGroupItem}>
              <ThemeToggler isCollapsed={isCollapsed}></ThemeToggler>
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
      </aside>
      {Component && (
        <Panel title={activeItem?.title}>
          <Component />
        </Panel>
      )}
    </Flex>
  );
}

export default Sidebar;
