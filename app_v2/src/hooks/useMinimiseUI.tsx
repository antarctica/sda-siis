import { setSensorInfoPanelOpen } from '@/store/features/shipSlice';
import { useAppDispatch } from '@/store/hooks';

import { useMinimiseSidebar } from '../components/Sidebar/SidebarHooks';

export function useMinimiseUI() {
  const minimiseSidebar = useMinimiseSidebar();
  const dispatch = useAppDispatch();

  return () => {
    minimiseSidebar();
    dispatch(setSensorInfoPanelOpen(false));
  };
}
