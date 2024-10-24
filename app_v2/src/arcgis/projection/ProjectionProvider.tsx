import * as ProjectionEngine from '@arcgis/core/geometry/projection.js';
import React, { useCallback, useEffect, useState } from 'react';

type ProjectionContextValue = {
  isLoaded: boolean;
  project: typeof ProjectionEngine.project;
};

export const ProjectionContext = React.createContext<ProjectionContextValue>({
  isLoaded: false,
  project: () => {
    throw new Error('Projection engine not loaded');
  },
});

export function ProjectionProvider({ children }: React.PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    ProjectionEngine.load().then(() => setIsLoaded(true));
  }, []);

  const safeProject = useCallback(
    (...args: Parameters<typeof ProjectionEngine.project>) => {
      if (!isLoaded) {
        throw new Error('Projection engine not loaded');
      }
      return ProjectionEngine.project(...args);
    },
    [isLoaded],
  );

  return (
    <ProjectionContext.Provider value={{ isLoaded, project: safeProject }}>
      {children}
    </ProjectionContext.Provider>
  );
}
