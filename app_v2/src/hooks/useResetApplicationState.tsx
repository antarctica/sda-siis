import { useResetLayers } from '@/features/layersManagement/components/LayerManager/hooks/useResetLayers';

export function useResetApplicationState() {
  const resetLayerManagerLayers = useResetLayers();
  return () => {
    resetLayerManagerLayers();
  };
}
