import { SidebarButton } from '../Sidebar/actions/SidebarButton';
import { DarkModeSwitch } from './DarkModeSwitch';
import { useTheme } from './useTheme';

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
