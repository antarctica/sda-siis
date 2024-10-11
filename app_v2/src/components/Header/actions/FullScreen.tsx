import { Action } from '@/components/Header/actions/Actions';
import SvgIcon from '@/components/SvgIcon';

export function FullScreen() {
  return (
    <Action
      icon={<SvgIcon name="icon-fullscreen" size={20} />}
      aria-label={'Toggle Full Screen'}
      onPress={() => {
        //toggle fullscreen
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      }}
    />
  );
}
