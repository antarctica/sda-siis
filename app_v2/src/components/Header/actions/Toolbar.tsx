import { cva } from '@styled-system/css';
import { Toolbar as RACToolbar } from 'react-aria-components';

import SvgIcon from '@/components/common/SvgIcon';
import useIsMobile from '@/hooks/useIsMobile';
import { useMinimiseUI } from '@/hooks/useMinimiseUI';

import { Action } from './Actions';
import { FullScreen } from './FullScreen';
import { SelectProjection } from './SelectProjection';

const toolbarRecipe = cva({
  base: {
    display: 'flex',
    gap: '3',
    h: 'full',
    pr: '1',
    alignItems: 'center',
  },
});

export function Toolbar() {
  const isMobile = useIsMobile();
  const minimiseUI = useMinimiseUI();
  return (
    <RACToolbar className={toolbarRecipe()} aria-label="App Toolbar">
      {!isMobile && <FullScreen />}
      <Action
        icon={<SvgIcon name="icon-minimise-ui" size={20} />}
        aria-label={'Minimise UI'}
        onPress={minimiseUI}
      ></Action>
      <Action
        icon={<SvgIcon name="icon-settings" size={20} />}
        aria-label={'Settings'}
        onPress={() => {}}
      ></Action>
      <SelectProjection />
      <Action
        icon={<SvgIcon name="icon-info" size={20} />}
        aria-label={'Information'}
        onPress={() => {}}
      ></Action>
    </RACToolbar>
  );
}
