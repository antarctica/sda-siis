import { defineSemanticTokens, defineTokens } from '@pandacss/dev';

export const colorsTokens = defineTokens.colors({
  transparent: { value: 'transparent' },
  white: { value: '#ffffff' },
  black: { value: '#000000' },
  grayscale: {
    DEFAULT: {
      description: 'The default grayscale color used in the UI.',
      value: '#777777',
    },
    100: { value: '#F7F7F7' },
    200: { value: '#EEEEEE' },
    300: { value: '#d5d5d5' },
    350: { value: '#cfcfcf' },
    400: { value: '#999999' },
    500: { value: '#777777' },
    600: { value: '#555555' },
    700: { value: '#333333' },
    800: { value: '#222222' },
  },
  yellow: {
    DEFAULT: { value: '#FFBF47' },
    lighter: { value: '#FFE9C0' },
    light: { value: '#FFD484' },
    base: { value: '#FFBF47' },
    dark: { value: '#AB8030' },
    darker: { value: '#574118' },
  },
  orange: {
    DEFAULT: { value: '#F47738' },
    lighter: { value: '#FBD1BB' },
    light: { value: '#F8A47A' },
    base: { value: '#F47738' },
    dark: { value: '#A35026' },
    darker: { value: '#532813' },
  },
  aircraftRed: {
    DEFAULT: { value: '#CC0033' },
    lighter: { value: '#EEA8BA' },
    light: { value: '#DD5476' },
    base: { value: '#CC0033' },
    dark: { value: '#890022' },
    darker: { value: '#450011' },
  },
  red: {
    DEFAULT: { value: '#B10E1E' },
    lighter: { value: '#E4ADB3' },
    light: { value: '#CB5E68' },
    base: { value: '#B10E1E' },
    dark: { value: '#770914' },
    darker: { value: '#3C050A' },
  },
  babyPink: {
    DEFAULT: { value: '#F499BE' },
    lighter: { value: '#FBDCE9' },
    light: { value: '#F8BBD3' },
    base: { value: '#F499BE' },
    dark: { value: '#A3677F' },
    darker: { value: '#533441' },
  },
  pink: {
    DEFAULT: { value: '#D53880' },
    lighter: { value: '#F1BBD4' },
    light: { value: '#E37AAA' },
    base: { value: '#D53880' },
    dark: { value: '#8F2656' },
    darker: { value: '#48132C' },
  },
  fuschia: {
    DEFAULT: { value: '#912B88' },
    lighter: { value: '#DAB7D7' },
    light: { value: '#B571AF' },
    base: { value: '#912B88' },
    dark: { value: '#611D5B' },
    darker: { value: '#310F2E' },
  },
  mauve: {
    DEFAULT: { value: '#6F72AF' },
    lighter: { value: '#CECFE4' },
    light: { value: '#9FA1C9' },
    base: { value: '#6F72AF' },
    dark: { value: '#4A4C75' },
    darker: { value: '#26273C' },
  },
  skyBlue: {
    DEFAULT: { value: '#2B8CC4' },
    lighter: { value: '#B7D8EB' },
    light: { value: '#71B2D7' },
    base: { value: '#2B8CC4' },
    dark: { value: '#1D5E83' },
    darker: { value: '#0F3043' },
  },
  blue: {
    lighter: { value: '#A8BCC8' },
    light: { value: '#547B92' },
    base: { value: '#003A5D' },
    dark: { value: '#00273E' },
    darker: { value: '#001420' },
    backlog: { value: '#2E358B' },
  },
  turquoise: {
    lighter: { value: '#B6DFDC' },
    light: { value: '#6FC0B9' },
    base: { value: '#28A197' },
    dark: { value: '#1B6C65' },
    darker: { value: '#0E3733' },
  },
  green: {
    DEFAULT: { value: '#379245' },
    lighter: { value: '#BBDAC0' },
    light: { value: '#79B682' },
    base: { value: '#379245' },
    dark: { value: '#25622E' },
    darker: { value: '#133217' },
  },
  nercGreen: {
    DEFAULT: { value: '#AAB437' },
    lighter: { value: '#E2E6BB' },
    light: { value: '#C6CD79' },
    base: { value: '#AAB437' },
    dark: { value: '#727925' },
    darker: { value: '#3A3D13' },
  },
  brown: {
    DEFAULT: { value: '#795B2B' },
    lighter: { value: '#E6D7BE' },
    light: { value: '#CDAF7F' },
    base: { value: '#B58840' },
    dark: { value: '#795B2B' },
    darker: { value: '#3E2E16' },
  },

  externalService: {
    twitter: { value: '#55ACEE' },
    facebook: { value: '#3B5998' },
    youtube: { value: '#CD201F' },
    rss: { value: '#F26522' },
    orcid: { value: '#A6CE39' },
  },
});

export const semanticColorTokens = defineSemanticTokens.colors({
  htmlBackground: {
    value: {
      base: '{colors.grayscale.700}',
    },
  },
  bodyBackground: {
    value: {
      base: '{colors.white}',
    },
  },
  text: {
    value: {
      base: '{colors.grayscale.600}',
    },
  },
  link: {
    DEFAULT: {
      value: {
        base: '{colors.skyBlue.base}',
      },
    },
    hover: {
      value: {
        base: '{colors.skyBlue.dark}',
      },
    },
  },
  component: {
    bg: {
      DEFAULT: {
        value: {
          base: '{colors.grayscale.200}',
        },
      },
      active: {
        value: {
          base: '{colors.skyBlue.base}',
        },
      },
      inverse: {
        value: {
          base: '{colors.grayscale.600}',
        },
      },
    },
    fg: {
      DEFAULT: {
        value: {
          base: '{colors.grayscale.700}',
        },
      },
      active: {
        value: {
          base: '{colors.skyBlue.light}',
        },
      },
      inverse: {
        value: {
          base: '{colors.grayscale.200}',
        },
      },
    },
  },
  success: {
    DEFAULT: {
      value: {
        base: '{colors.green.base}',
      },
    },
    text: {
      value: {
        base: '{colors.green.dark}',
      },
    },
    bg: {
      value: {
        base: '{colors.green.lighter}',
      },
    },
  },
  warning: {
    DEFAULT: {
      value: {
        base: '{colors.yellow.base}',
      },
    },
    text: {
      value: {
        base: '{colors.yellow.dark}',
      },
    },
    bg: {
      value: {
        base: '{colors.yellow.lighter}',
      },
    },
  },
  danger: {
    DEFAULT: {
      value: {
        base: '{colors.red.base}',
      },
    },
    text: {
      value: {
        base: '{colors.red.dark}',
      },
    },
    bg: {
      value: {
        base: '{colors.red.lighter}',
      },
    },
  },
  info: {
    DEFAULT: {
      value: {
        base: '{colors.skyBlue.base}',
      },
    },
    text: {
      value: {
        base: '{colors.skyBlue.dark}',
      },
    },
    bg: {
      value: {
        base: '{colors.skyBlue.lighter}',
      },
    },
  },
  accent: {
    primary: {
      DEFAULT: {
        value: {
          base: '{colors.turquoise.base}',
        },
      },
      text: {
        value: {
          base: '{colors.turquoise.dark}',
        },
      },
    },
    experimental: {
      DEFAULT: {
        value: {
          base: '{colors.mauve.base}',
        },
      },
      text: {
        value: {
          base: '{colors.mauve.dark}',
        },
      },
    },
  },
  developmentPhases: {
    backlog: {
      value: {
        base: '{colors.blue.backlog}',
      },
    },
    discovery: {
      value: {
        base: '{colors.fuschia.base}',
      },
    },
    alpha: {
      value: {
        base: '{colors.pink.base}',
      },
    },
    beta: {
      value: {
        base: '{colors.orange.base}',
      },
    },
    live: {
      value: {
        base: '{colors.nercGreen.base}',
      },
    },
    retired: {
      value: {
        base: '{colors.grayscale.600}',
      },
    },
  },
  basThemes: {
    polarScience: {
      value: {
        base: '{colors.red.base}',
      },
    },
    polarOperations: {
      value: {
        base: '{colors.orange.base}',
      },
    },
    polarArts: {
      value: {
        base: '{colors.fuschia.base}',
      },
    },
    polarPeople: {
      value: {
        base: '{colors.skyBlue.dark}',
      },
    },
    polarEnvironment: {
      value: {
        base: '{colors.grayscale.700}',
      },
    },
    polarWildlife: {
      value: {
        base: '{colors.yellow.base}',
      },
    },
  },
  basFacilities: {
    rothera: {
      value: {
        base: '{colors.skyBlue.base}',
      },
    },
    birdIsland: {
      value: {
        base: '{colors.green.base}',
      },
    },
    kingEdwardPoint: {
      value: {
        base: '{colors.yellow.base}',
      },
    },
    sirDavidAttenborough: {
      value: {
        base: '{colors.red.base}',
      },
    },
  },
  externalServices: {
    twitter: {
      value: {
        base: '{colors.externalService.twitter}',
      },
    },
    facebook: {
      value: {
        base: '{colors.externalService.facebook}',
      },
    },
    youtube: {
      value: {
        base: '{colors.externalService.youtube}',
      },
    },
    rss: {
      value: {
        base: '{colors.externalService.rss}',
      },
    },
    orcid: {
      value: {
        base: '{colors.externalService.orcid}',
      },
    },
  },
});
