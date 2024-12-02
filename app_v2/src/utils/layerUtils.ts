import { LayerTimeInfo } from '@/features/mapLayers/components/LayerManager/machines/types';

export function isSingleDateTimeInfo(timeInfo?: LayerTimeInfo) {
  return timeInfo?.type === 'single';
}
