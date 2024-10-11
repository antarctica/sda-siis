import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';

import useIsMobile from '@/hooks/useIsMobile';

import SIISLogo from '../SIISLogo';
import { Heading } from '../Typography';

export function Title() {
  const isMobile = useIsMobile();
  return (
    <Flex
      gap="2"
      align="center"
      height={{
        base: '12',
        md: '16',
      }}
    >
      <SIISLogo size={isMobile ? 32 : 40} />
      <Heading
        as="h1"
        heading="heading-1"
        margin={false}
        className={css({
          color: 'fg',
          _dark: {
            color: 'fg.accent',
          },
        })}
      >
        SIIS
      </Heading>
    </Flex>
  );
}
