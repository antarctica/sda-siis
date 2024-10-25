import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';

import useIsMobile from '@/hooks/useIsMobile';

import { Heading } from '../common/Typography';
import SIISLogo from '../SIISLogo';

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
        })}
      >
        SIIS
      </Heading>
    </Flex>
  );
}
