import { Divider, Flex } from '@styled-system/jsx';

import SvgIcon from '@/components/common/SvgIcon';
import { Heading } from '@/components/common/Typography';
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
      <Heading as="h2" heading="heading-3" margin={false}>
        {title}
      </Heading>
      <Flex alignItems="center" gap="3">
        <TabList>{tabs?.map((tab) => <Tab key={tab.id} {...tab} />)}</TabList>
        <Divider orientation="vertical" color={'bg.base.border'} thickness="thin" h="12" />
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
