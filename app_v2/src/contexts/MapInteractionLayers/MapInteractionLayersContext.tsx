import * as React from 'react';

import { MapInteractionLayersType } from './types';

export const MapInteractionLayersContext = React.createContext<MapInteractionLayersType | null>(
  null,
);
