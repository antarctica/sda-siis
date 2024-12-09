export interface MapInteractionLayersType {
  measurementInteraction: MapInteractionLayer;
  shipPositionInteraction: MapInteractionLayer;
  routesInteraction: MapInteractionLayer;
}

export type MapInteractionLayer = {
  layer: __esri.GraphicsLayer;
  alwaysVisible?: boolean;
};
