import { assertEvent, assign, setup } from 'xstate';

import { SidebarItem } from './types';

interface ISidebarMachineContext {
  items: SidebarItem[];
  activeItem: string | null;
}

type SidebarEvents =
  | {
      type: 'COLLAPSE.TOGGLE';
    }
  | {
      type: 'ITEMS.SET_ACTIVE';
      id: string;
    }
  | {
      type: 'ITEMS.CLOSE_ALL';
    };

const defaultContext: ISidebarMachineContext = {
  items: [],
  activeItem: null,
};

export const sideBarMachine = setup({
  types: {
    context: {} as ISidebarMachineContext,
    events: {} as SidebarEvents,
    input: {} as Partial<ISidebarMachineContext>,
  },
  actions: {
    'Set Active Item': assign(({ event, context }) => {
      assertEvent(event, 'ITEMS.SET_ACTIVE');

      if (context.items.some((item) => item.id === event.id && item.type === 'panel')) {
        return { activeItem: event.id };
      } else {
        console.warn('Invalid item ID:', event.id);
        return { activeItem: null };
      }
    }),
    'Close All Items': assign({ activeItem: null }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGUCWEwCMCGAnAxAJIAqAogLLIB0ypxA+gIIDCxhAaqQNoAMAuolAAHAPaxUAF1QiAdoJAAPRAEYAHDyoAmAJw6A7ADYAzHu1HtAFgCsRgDQgAnip6qq1o8s1WAvt-toMHAISCmpmABkAeVomcPDeASQQUXEpWXklBDUjLU1NAysDL3snLM1ff3QsPCpmEQAbeuwhWEh8Zki4xgAFWipiSIBxQfDufnkUyWk5JMzlPVcDAwseIqsSxCMdKm1VrwqQAOrcKlIFIWwZDAh2zvCevoHh0YSJsSn02ZUFqiWVtY2CE0pjcex8BxkIgw8CSRyCb1S0wyiAAtMpAcptModmCDnCanVGs1WhAER8ZqBMhY9IDNKorG5VNorKojGz2Wy8VUgqdzpdrmS0hTFJtVAYqGyrGY9OtHIg6XodkyWRyOb5fEA */
  id: 'Sidebar',
  context: ({ input }) => {
    return {
      ...defaultContext,
      ...input,
    };
  },
  initial: 'Collapsed',
  states: {
    Collapsed: {
      on: {
        'COLLAPSE.TOGGLE': {
          target: 'Expanded',
        },
      },
    },
    Expanded: {
      on: {
        'COLLAPSE.TOGGLE': {
          target: 'Collapsed',
        },
      },
    },
  },
  on: {
    'ITEMS.SET_ACTIVE': {
      actions: {
        type: 'Set Active Item',
        params: ({ event }) => ({ id: event.id }),
      },
    },
    'ITEMS.CLOSE_ALL': {
      actions: 'Close All Items',
    },
  },
});
