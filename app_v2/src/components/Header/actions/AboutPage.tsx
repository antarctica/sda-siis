import { css } from '@styled-system/css';
import React from 'react';
import { DialogTrigger, OverlayTriggerStateContext } from 'react-aria-components';

import { Button } from '@/components/common/Button';
import Dialog from '@/components/common/Dialog';
import Modal from '@/components/common/Modal';
import SvgIcon from '@/components/common/SvgIcon';
import Typography, { Em, MailTo } from '@/components/common/Typography';
import { Action } from '@/components/Header/actions/Actions';
import SIISLogo from '@/components/SIISLogo';

function ModalFooter() {
  const { close } = React.useContext(OverlayTriggerStateContext)!;
  return (
    <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'end' })}>
      <Typography className={css({ color: 'fg.muted', textStyle: 'caption' })}>
        Version {import.meta.env.VITE_VERSION}
      </Typography>
      <Button variant="primary" onPress={close}>
        Close
      </Button>
    </div>
  );
}

export function AboutPage() {
  return (
    <DialogTrigger>
      <Action icon={<SvgIcon name="icon-info" size={20} />} aria-label={'About'} />
      <Modal isDismissable>
        <Dialog
          title="Sea Ice Information Service (SIIS)"
          icon={<SIISLogo size={40} />}
          size="lg"
          footer={<ModalFooter />}
        >
          <Typography margin>
            The SIIS supports safe navigation and route planning for the{' '}
            <Em>RRS Sir David Attenborough</Em> by providing up-to-date sea ice information for
            polar regions.
          </Typography>
          <Typography margin>
            SIIS offers tools for visualizing sea ice data, tracking the ship's position, and
            accessing key information products like satellite imagery and sea ice charts. Use the
            left-hand panel to select and manage layers, or explore the map for measurements and
            route planning.
          </Typography>
          <Typography margin>
            For assistance, please contact the Mapping and Geographic Information Centre (MAGIC) at{' '}
            <MailTo>magic@bas.ac.uk</MailTo>.
          </Typography>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
