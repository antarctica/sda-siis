import SvgIcon from '@/components/common/SvgIcon';
import { selectGraticuleVisible, setGraticuleVisible } from '@/store/features/appSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { SidebarButton } from './SidebarButton';

export function ShowGraticule({ isCollapsed }: { isCollapsed: boolean }) {
  const isGraticuleVisible = useAppSelector(selectGraticuleVisible);
  const dispatch = useAppDispatch();

  return (
    <SidebarButton
      collapsed={isCollapsed}
      onPress={() => {
        dispatch(setGraticuleVisible(!isGraticuleVisible));
      }}
      title={isGraticuleVisible ? 'Hide Graticule' : 'Show Graticule'}
      icon={
        <SvgIcon
          name={isGraticuleVisible ? 'icon-show-graticule' : 'icon-hide-graticule'}
          size={16}
        ></SvgIcon>
      }
      active={false}
    ></SidebarButton>
  );
}
