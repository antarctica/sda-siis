'use client';

import { css } from '@styled-system/css';
import { Divider, Flex } from '@styled-system/jsx';
import React from 'react';

import { IconButton } from '@/components/common/Button';

import MobileDialog from '../common/MobileDialog';
import SvgIcon from '../common/SvgIcon';
import { Title } from '../common/Typography';
import { HeaderBarTitle } from '../Header/Title';
import { SidebarButton } from '../Sidebar/actions/SidebarButton';
import { useSidebarItems } from '../Sidebar/SidebarHooks';
import { SidebarContext } from '../Sidebar/SideBarProvider';

export default function MobileSideMenu() {
  const items = useSidebarItems();
  const actorRef = SidebarContext.useActorRef();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <IconButton
        variant="surface"
        tooltipPlacement="bottom"
        aria-label="Open Menu"
        onPress={() => setIsOpen(true)}
        icon={<SvgIcon name="icon-menu" size={20}></SvgIcon>}
      ></IconButton>
      <MobileDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Flex
          position={'fixed'}
          top={'0'}
          left={'0'}
          alignItems={'center'}
          h={{ base: '12', md: '16' }}
          p={'2'}
        >
          <HeaderBarTitle />
        </Flex>
        <nav id="mobile-side-menu">
          <Title
            as="h2"
            className={css({
              w: 'full',
              marginTop: '8',
            })}
            size="xl"
            lineBarPosition="end"
          >
            Menu
          </Title>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <SidebarButton
                  collapsed={false}
                  active={false}
                  title={item.title}
                  icon={item.icon}
                  onPress={() => {
                    actorRef.send({ type: 'ITEMS.SET_ACTIVE', id: item.id });
                    setIsOpen(false);
                  }}
                ></SidebarButton>
                <Divider orientation="horizontal" thickness="thin" color="bg.base.border"></Divider>
              </li>
            ))}
          </ul>
        </nav>
      </MobileDialog>
    </>
  );
}
