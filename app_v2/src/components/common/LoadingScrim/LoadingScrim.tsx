import { cva } from '@styled-system/css';
import { Box } from '@styled-system/jsx';

import SpinLoader from '../SpinLoader';

const loadingScrim = cva({
  base: {
    position: 'absolute',
    inset: '0',
    width: 'full',
    height: 'full',
    bg: 'htmlBackground',
    opacity: 0,
    placeContent: 'center',
    _motionSafe: {
      transition: 'all',
      transitionDuration: 'slowest',
      transitionBehavior: 'allow-discrete',
    },
  },
  variants: {
    isLoading: {
      true: {
        display: 'grid',
        opacity: '1',
      },
      false: {
        display: 'none',
        opacity: '0',
      },
    },
  },
});
function LoadingScrim({ isLoading }: { isLoading: boolean }) {
  return (
    <Box className={loadingScrim({ isLoading })}>
      <SpinLoader size={100}></SpinLoader>
    </Box>
  );
}

export default LoadingScrim;
