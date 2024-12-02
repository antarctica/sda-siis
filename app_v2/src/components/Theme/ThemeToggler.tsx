import { SidebarButton } from '@/components/Sidebar/actions/SidebarButton';
import { useTheme } from '@/contexts/Theme/useTheme';

import { DarkModeSwitch } from './DarkModeSwitch';

export function ThemeToggler({ isCollapsed }: { isCollapsed: boolean }) {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <SidebarButton
      collapsed={isCollapsed}
      onPress={() => {
        toggleTheme();
      }}
      title={'Toggle Theme'}
      icon={
        <DarkModeSwitch
          moonColor="white"
          sunColor="black"
          checked={currentTheme === 'dark'}
          size={16}
        />
      }
      active={false}
    ></SidebarButton>
  );
}
