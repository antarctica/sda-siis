import { LineGraphic } from '@/types';

export type RouteGraphic = LineGraphic<{
  route_name: string;
}>;

export function isRouteGraphic(graphic: __esri.Graphic): graphic is RouteGraphic {
  return typeof graphic.getAttribute('route_name') === 'string';
}
