import { LayerTimeInfo } from '@/features/layersManagement/components/LayerManager/machines/types';

export function isSingleDateTimeInfo(timeInfo?: LayerTimeInfo) {
  return timeInfo?.type === 'single';
}
