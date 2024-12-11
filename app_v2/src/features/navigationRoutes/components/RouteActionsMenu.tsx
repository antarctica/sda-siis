import { DialogTrigger } from 'react-aria-components';

import { IconButton } from '@/components/common/Button';
import { SelectionMenuItem, StaticSelectionMenu } from '@/components/common/SelectionMenu';
import SvgIcon from '@/components/common/SvgIcon';

export type RouteAction = 'edit-route' | 'delete-route' | 'export-route';

const items: SelectionMenuItem<RouteAction>[] = [
  {
    label: 'Edit Route',
    id: 'edit-route',
    value: 'edit-route',
    icon: 'icon-edit',
  },
  { label: 'Delete Route', value: 'delete-route', id: 'delete-route', icon: 'icon-trash' },
  { label: 'Export Route', value: 'export-route', id: 'export-route', icon: 'icon-import' },
];

export function RouteActionsMenu({
  handleRouteAction,
}: {
  handleRouteAction: (action: RouteAction) => void;
}) {
  return (
    <StaticSelectionMenu
      isActionMenu
      label="Route Actions"
      items={items}
      onSelect={(action) => handleRouteAction(action)}
      trigger={
        <DialogTrigger>
          <IconButton
            size="md"
            tooltipPlacement="bottom"
            variant="surface"
            icon={<SvgIcon name="icon-data-settings" size={16} />}
            aria-label={'Route Actions'}
          />
        </DialogTrigger>
      }
    />
  );
}
