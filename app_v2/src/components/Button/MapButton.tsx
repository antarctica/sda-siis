import { css, cx } from '@styled-system/css';

import { IconButton, IconButtonProps } from './IconButton';

export function MapButton({ className, ...props }: IconButtonProps & { includeBorder?: boolean }) {
  return (
    <IconButton
      variant="surface"
      {...props}
      className={cx(
        css({
          md: {
            w: '10',
            h: '10',
          },
          mdDown: {
            w: '8',
            h: '8',
          },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }),
        className,
      )}
    />
  );
}
