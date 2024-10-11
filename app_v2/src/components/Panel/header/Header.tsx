import SvgIcon from '@/components/SvgIcon';
import { Heading } from '@/components/Typography';

import { panelStyles } from '../panelRecipe';
import { HeaderAction } from './Action';

export function PanelHeader({ title, onClose }: { title: string; onClose: () => void }) {
  const { header } = panelStyles();
  return (
    <header className={header}>
      <Heading as="h2" heading="heading-3" margin={false}>
        {title}
      </Heading>
      <div>
        <HeaderAction
          autoFocus
          onClick={() => {
            onClose();
          }}
          title="Close"
          icon={<SvgIcon size={20} name="icon-x"></SvgIcon>}
        ></HeaderAction>
      </div>
    </header>
  );
}
