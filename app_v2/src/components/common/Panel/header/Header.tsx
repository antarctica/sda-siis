import { Divider, Flex } from '@styled-system/jsx';

import SvgIcon from '@/components/common/SvgIcon';
import { Title } from '@/components/common/Typography';
import { PanelTab } from '@/components/Sidebar/types';

import { panelStyles } from '../panelRecipe';
import { Tab, TabList } from '../tabs/Tabs';
import { HeaderAction } from './Action';

export function PanelHeader({
  title,
  onClose,
  tabs,
}: {
  title: string;
  tabs?: PanelTab[];
  onClose: () => void;
}) {
  const { header } = panelStyles();
  return (
    <header className={header}>
      <Title as="h2" size="lg" margin={false}>
        {title}
      </Title>
      <Flex gap="3" alignItems="center">
        <TabList>{tabs?.map((tab) => <Tab key={tab.id} {...tab} />)}</TabList>
        <Divider orientation="vertical" thickness="thin" h="12" color={'bg.base.border'} />
        <HeaderAction
          autoFocus
          onPress={() => {
            onClose();
          }}
          title="Close"
          icon={<SvgIcon size={20} name="icon-x"></SvgIcon>}
        ></HeaderAction>
      </Flex>
    </header>
  );
}
