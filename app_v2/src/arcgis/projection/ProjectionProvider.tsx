import * as ProjectionEngine from '@arcgis/core/geometry/projection.js';
import React from 'react';

type ProjectionContextValue = {
  isLoaded: boolean;
  project: (
    point: __esri.Point,
    to: __esri.SpatialReference,
    geographicTransformation?: __esri.GeographicTransformation,
  ) => Promise<__esri.Geometry | __esri.Geometry[]>;
};

export const ProjectionContext = React.createContext<ProjectionContextValue | undefined>(undefined);

export function ProjectionProvider({ children }: React.PropsWithChildren) {
  React.useEffect(() => {
    ProjectionEngine.load();
  }, []);

  const project = React.useCallback(
    async (
      point: __esri.Point,
      to: __esri.SpatialReference,
      geographicTransformation?: __esri.GeographicTransformation,
    ) => {
      if (!ProjectionEngine.isLoaded()) {
        await ProjectionEngine.load();
      }
      return ProjectionEngine.project(point, to, geographicTransformation);
    },
    [],
  );

  return (
    <ProjectionContext.Provider value={{ isLoaded: ProjectionEngine.isLoaded(), project }}>
      {children}
    </ProjectionContext.Provider>
  );
}
