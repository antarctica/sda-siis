import { useEffect, useState } from 'react';

import { LayerMachineActor } from '../machines/types';

export function useEnabledChildCount(children: LayerMachineActor[]) {
  const [enabledChildCount, setEnabledChildCount] = useState(0);

  useEffect(() => {
    function countEnabledChildren() {
      return children.filter((child) => child.getSnapshot().matches('enabled')).length;
    }

    setEnabledChildCount(countEnabledChildren());

    const subscriptions = children.map((child) =>
      child.subscribe(() => {
        setEnabledChildCount(countEnabledChildren());
      }),
    );

    return () => {
      subscriptions.forEach(({ unsubscribe }) => unsubscribe());
    };
  }, [children]);
  return enabledChildCount;
}
