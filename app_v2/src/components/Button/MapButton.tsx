import { css } from '@styled-system/css';
import { Box } from '@styled-system/jsx';

import { IconButton, IconButtonProps } from './IconButton';

export function MapButton(
  props: Omit<IconButtonProps, 'className'> & {
    includeBorder?: boolean;
  },
) {
  if (props.includeBorder) {
    return (
      <Box
        className={css({
          boxShadow: 'md',
          bg: 'bg.base',
          borderColor: 'bg.base.border',
          borderWidth: 'thin',
        })}
      >
        <IconButton
          disableTooltip
          {...props}
          className={css({
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
          })}
        />
      </Box>
    );
  }

  return (
    <IconButton
      {...props}
      className={css({
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
      })}
      style={{ padding: 0 }}
    />
  );
}
