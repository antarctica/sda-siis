import { cva } from '@styled-system/css';
import { Divider } from '@styled-system/jsx';
import React from 'react';
import { Toolbar as RACToolbar } from 'react-aria-components';

import SvgIcon from '@/components/common/SvgIcon';
import useIsMobile from '@/hooks/useIsMobile';
import { useMinimiseUI } from '@/hooks/useMinimiseUI';

import { AboutPage } from './AboutPage';
import { Action } from './Actions';
import { FullScreen } from './FullScreen';
import GlobalSettingsMenu from './GlobalSettings/GlobalSettingsMenu';
import { SelectProjection } from './SelectProjection';

const toolbarRecipe = cva({
  base: {
    display: 'flex',
    gap: '3',
    alignItems: 'center',
    h: 'full',
    pr: '1',
  },
});

function ToolbarDivider() {
  return (
    <Divider
      orientation={'vertical'}
      thickness={'thin'}
      display={{ base: 'none', md: 'block' }}
      h={'full'}
      color="bg.base.border"
    />
  );
}

export function Toolbar() {
  const isMobile = useIsMobile();
  const minimiseUI = useMinimiseUI();

  const toolbarItems = React.useMemo(() => {
    const items = [
      !isMobile && <FullScreen key="fullscreen" />,
      !isMobile && (
        <Action
          key="minimise"
          icon={<SvgIcon name="icon-minimise-ui" size={20} />}
          aria-label="Minimise UI"
          onPress={minimiseUI}
        />
      ),
      <GlobalSettingsMenu key="settings" />,
      <SelectProjection key="projection" />,
      <AboutPage key="about" />,
    ].filter(Boolean);

    return items;
  }, [isMobile, minimiseUI]);

  const itemsWithDividers = React.useMemo(() => {
    return toolbarItems.reduce<React.ReactNode[]>((acc, item, index) => {
      if (index === 0) {
        acc.push(<ToolbarDivider key={`divider-start`} />);
      }
      acc.push(item);
      if (index !== toolbarItems.length - 1) {
        acc.push(<ToolbarDivider key={`divider-${index}`} />);
      }
      return acc;
    }, []);
  }, [toolbarItems]);

  return (
    <RACToolbar className={toolbarRecipe()} aria-label="App Toolbar">
      {itemsWithDividers}
    </RACToolbar>
  );
}
