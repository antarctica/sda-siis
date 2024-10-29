import { cva } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';

import useIsMobile from '@/hooks/useIsMobile';

import MobileSideMenu from '../MobileSideMenu';
import { Toolbar } from './actions/Toolbar';
import { HeaderData } from './data/HeaderData';
import { Title } from './Title';

const headerStyles = cva({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'full',

    height: 'fit',

    bg: 'bg.base',
    zIndex: 2,
    px: '2',
    gap: '2',

    _light: {
      shadow: 'sm',
    },
    _dark: {
      borderColor: 'bg.base.border',
      borderBottomWidth: 'thin',
      borderStyle: 'inset',
    },
  },
});

export function Header() {
  const isMobile = useIsMobile();
  return (
    <header className={headerStyles()}>
      <Flex gap="4" h="full" alignItems="center" shrink={'1'} minW="0">
        <Title />
        <Divider
          h={'full'}
          orientation={'vertical'}
          thickness={'thin'}
          color="bg.base.border"
        ></Divider>
        {!isMobile && <HeaderData />}
      </Flex>
      <Toolbar />
      {isMobile && (
        <Flex h={'full'} alignItems={'center'} justifyContent={'center'} gap={'2'}>
          <Divider
            h={'full'}
            orientation={'vertical'}
            thickness={'thin'}
            color="bg.base.border"
          ></Divider>{' '}
          <MobileSideMenu />
        </Flex>
      )}
    </header>
  );
}

export default Header;
