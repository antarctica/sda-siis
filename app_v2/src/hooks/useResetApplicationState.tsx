import { useResetLayers } from '@/components/LayerManager/hooks/useResetLayers';
import { reset as resetShipAppState } from '@/store/features/shipSlice';
import { useAppDispatch } from '@/store/hooks';

export function useResetApplicationState() {
  const resetLayerManagerLayers = useResetLayers();
  const dispatch = useAppDispatch();
  return () => {
    resetLayerManagerLayers();
    dispatch(resetShipAppState());
  };
}
