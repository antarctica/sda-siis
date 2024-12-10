import { cva } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';

import useIsMobile from '@/hooks/useIsMobile';

import MobileSideMenu from '../MobileSideMenu';
import { Toolbar } from './actions/Toolbar';
import { HeaderData } from './data/HeaderData';
import { HeaderBarTitle } from './Title';

const headerStyles = cva({
  base: {
    display: 'flex',
    zIndex: 2,
    gap: '2',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 'full',

    height: 'fit',

    px: '2',
    bg: 'bg.base',
    _dark: {
      borderBottomWidth: 'thin',
      borderColor: 'bg.base.border',
      borderStyle: 'inset',
    },
    _light: {
      shadow: 'sm',
    },
  },
});

export function Header() {
  const isMobile = useIsMobile();
  return (
    <header className={headerStyles()}>
      <Flex gap="4" shrink={'1'} alignItems="center" minW="0" h="full">
        <HeaderBarTitle />
        <Divider
          orientation={'vertical'}
          thickness={'thin'}
          h={'full'}
          color="bg.base.border"
        ></Divider>
        {!isMobile && <HeaderData />}
      </Flex>
      <Toolbar />
      {isMobile && (
        <Flex gap={'2'} justifyContent={'center'} alignItems={'center'} h={'full'}>
          <Divider
            orientation={'vertical'}
            thickness={'thin'}
            h={'full'}
            color="bg.base.border"
          ></Divider>
          <MobileSideMenu />
        </Flex>
      )}
    </header>
  );
}

export default Header;
