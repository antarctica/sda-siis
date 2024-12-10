import { css } from '@styled-system/css';
import { Flex } from '@styled-system/jsx';

import useIsMobile from '@/hooks/useIsMobile';

import { Title } from '../common/Typography';
import SIISLogo from '../SIISLogo';

export function HeaderBarTitle() {
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
      <Title
        as="h1"
        className={css({
          color: 'fg',
        })}
        size="2xl"
        margin={false}
      >
        SIIS
      </Title>
    </Flex>
  );
}
