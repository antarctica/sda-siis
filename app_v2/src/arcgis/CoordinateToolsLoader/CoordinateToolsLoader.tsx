import * as coordinateFormatter from '@arcgis/core/geometry/coordinateFormatter.js';
import * as ProjectionEngine from '@arcgis/core/geometry/projection.js';
import { useEffect, useState } from 'react';

export default function CoordinateToolsLoader({ children }: React.PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Promise.all([coordinateFormatter.load(), ProjectionEngine.load()]).then(() =>
      setIsLoaded(true),
    );
  }, []);

  if (!isLoaded) {
    return null; // Or return a loading indicator if preferred
  }

  return <>{children}</>;
}
