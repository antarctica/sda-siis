import { defineSemanticTokens, defineTokens } from '@pandacss/dev';

export const basColorTokens = defineTokens.colors({
  bas_grayscale: {
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
  bas_yellow: {
    DEFAULT: { value: '#FFBF47' },
    lighter: { value: '#FFE9C0' },
    light: { value: '#FFD484' },
    base: { value: '#FFBF47' },
    dark: { value: '#AB8030' },
    darker: { value: '#574118' },
  },
  bas_orange: {
    DEFAULT: { value: '#F47738' },
    lighter: { value: '#FBD1BB' },
    light: { value: '#F8A47A' },
    base: { value: '#F47738' },
    dark: { value: '#A35026' },
    darker: { value: '#532813' },
  },
  bas_aircraftRed: {
    DEFAULT: { value: '#CC0033' },
    lighter: { value: '#EEA8BA' },
    light: { value: '#DD5476' },
    base: { value: '#CC0033' },
    dark: { value: '#890022' },
    darker: { value: '#450011' },
  },
  bas_red: {
    DEFAULT: { value: '#B10E1E' },
    lighter: { value: '#E4ADB3' },
    light: { value: '#CB5E68' },
    base: { value: '#B10E1E' },
    dark: { value: '#770914' },
    darker: { value: '#3C050A' },
  },
  bas_babyPink: {
    DEFAULT: { value: '#F499BE' },
    lighter: { value: '#FBDCE9' },
    light: { value: '#F8BBD3' },
    base: { value: '#F499BE' },
    dark: { value: '#A3677F' },
    darker: { value: '#533441' },
  },
  bas_pink: {
    DEFAULT: { value: '#D53880' },
    lighter: { value: '#F1BBD4' },
    light: { value: '#E37AAA' },
    base: { value: '#D53880' },
    dark: { value: '#8F2656' },
    darker: { value: '#48132C' },
  },
  bas_fuschia: {
    DEFAULT: { value: '#912B88' },
    lighter: { value: '#DAB7D7' },
    light: { value: '#B571AF' },
    base: { value: '#912B88' },
    dark: { value: '#611D5B' },
    darker: { value: '#310F2E' },
  },
  bas_mauve: {
    DEFAULT: { value: '#6F72AF' },
    lighter: { value: '#CECFE4' },
    light: { value: '#9FA1C9' },
    base: { value: '#6F72AF' },
    dark: { value: '#4A4C75' },
    darker: { value: '#26273C' },
  },
  bas_skyBlue: {
    DEFAULT: { value: '#2B8CC4' },
    lighter: { value: '#B7D8EB' },
    light: { value: '#71B2D7' },
    base: { value: '#2B8CC4' },
    dark: { value: '#1D5E83' },
    darker: { value: '#0F3043' },
  },
  bas_blue: {
    lighter: { value: '#A8BCC8' },
    light: { value: '#547B92' },
    base: { value: '#003A5D' },
    dark: { value: '#00273E' },
    darker: { value: '#001420' },
    backlog: { value: '#2E358B' },
  },
  bas_turquoise: {
    lighter: { value: '#B6DFDC' },
    light: { value: '#6FC0B9' },
    base: { value: '#28A197' },
    dark: { value: '#1B6C65' },
    darker: { value: '#0E3733' },
  },
  bas_green: {
    DEFAULT: { value: '#379245' },
    lighter: { value: '#BBDAC0' },
    light: { value: '#79B682' },
    base: { value: '#379245' },
    dark: { value: '#25622E' },
    darker: { value: '#133217' },
  },
  bas_nercGreen: {
    DEFAULT: { value: '#AAB437' },
    lighter: { value: '#E2E6BB' },
    light: { value: '#C6CD79' },
    base: { value: '#AAB437' },
    dark: { value: '#727925' },
    darker: { value: '#3A3D13' },
  },
  bas_brown: {
    DEFAULT: { value: '#795B2B' },
    lighter: { value: '#E6D7BE' },
    light: { value: '#CDAF7F' },
    base: { value: '#B58840' },
    dark: { value: '#795B2B' },
    darker: { value: '#3E2E16' },
  },
  bas_externalService: {
    twitter: { value: '#55ACEE' },
    facebook: { value: '#3B5998' },
    youtube: { value: '#CD201F' },
    rss: { value: '#F26522' },
    orcid: { value: '#A6CE39' },
  },
});

export const siisColorTokens = defineTokens.colors({
  siis_grey: {
    1: { value: '#fcfcfd' },
    2: { value: '#f9f9fb' },
    3: { value: '#eff0f3' },
    4: { value: '#e7e8ec' },
    5: { value: '#e0e1e6' },
    6: { value: '#d8d9e0' },
    7: { value: '#cdced7' },
    8: { value: '#b9bbc6' },
    9: { value: '#8b8d98' },
    10: { value: '#80828d' },
    11: { value: '#62636c' },
    12: { value: '#1e1f24' },
  },

  siis_greyAlpha: {
    a1: { value: '#00005503' },
    a2: { value: '#00005506' },
    a3: { value: '#00104010' },
    a4: { value: '#000b3618' },
    a5: { value: '#0009321f' },
    a6: { value: '#00073527' },
    a7: { value: '#00063332' },
    a8: { value: '#00083046' },
    a9: { value: '#00051d74' },
    a10: { value: '#00051b7f' },
    a11: { value: '#0002119d' },
    a12: { value: '#000107e1' },
  },

  siis_darkgrey: {
    1: { value: '#0e1114' },
    2: { value: '#16191d' },
    3: { value: '#1e2328' },
    4: { value: '#252a2f' },
    5: { value: '#2c3136' },
    6: { value: '#353a3f' },
    7: { value: '#42484d' },
    8: { value: '#5b6167' },
    9: { value: '#696f74' },
    10: { value: '#767c82' },
    11: { value: '#aeb4bb' },
    12: { value: '#ebeef2' },
  },

  siis_darkgreyAlpha: {
    a1: { value: '#0011d104' },
    a2: { value: '#74aefd0d' },
    a3: { value: '#96c9fc19' },
    a4: { value: '#acd3f921' },
    a5: { value: '#beddfd28' },
    a6: { value: '#c9e2fc32' },
    a7: { value: '#d1e9fd41' },
    a8: { value: '#dcedfd5d' },
    a9: { value: '#e3f1fd6b' },
    a10: { value: '#e4f1fd7a' },
    a11: { value: '#ecf4feb7' },
    a12: { value: '#f7fafef2' },
  },

  siis_purple: {
    DEFAULT: { value: '#9f3995' },
    1: { value: '#fffcfe' },
    2: { value: '#fdf7fc' },
    3: { value: '#fceaf9' },
    4: { value: '#fadef5' },
    5: { value: '#f4d0ee' },
    6: { value: '#edc1e5' },
    7: { value: '#e3acda' },
    8: { value: '#d691cc' },
    9: { value: '#9f3995' },
    10: { value: '#8f2986' },
    11: { value: '#a13b97' },
    12: { value: '#591853' },
  },
  siis_purpleAlpha: {
    a1: { value: '#ff00aa03' },
    a2: { value: '#c000a008' },
    a3: { value: '#db00b715' },
    a4: { value: '#d100aa21' },
    a5: { value: '#c400a32f' },
    a6: { value: '#b500953e' },
    a7: { value: '#a9008e53' },
    a8: { value: '#a000896e' },
    a9: { value: '#840077c6' },
    a10: { value: '#7a006fd6' },
    a11: { value: '#850078c4' },
    a12: { value: '#480041e7' },
  },
  siis_green: {
    1: { value: '#0c130b' },
    2: { value: '#121b11' },
    3: { value: '#142e12' },
    4: { value: '#123d10' },
    5: { value: '#184b15' },
    6: { value: '#205a1d' },
    7: { value: '#276b24' },
    8: { value: '#2d7f29' },
    9: { value: '#3ee738' },
    10: { value: '#2cdc28' },
    11: { value: '#2ddc28' },
    12: { value: '#aff5a8' },
  },
  siis_greenAlpha: {
    a1: { value: '#00bb0003' },
    a2: { value: '#29f9120b' },
    a3: { value: '#29f91920' },
    a4: { value: '#17fb0c30' },
    a5: { value: '#2efc223f' },
    a6: { value: '#42fd384f' },
    a7: { value: '#4afd4361' },
    a8: { value: '#4eff4576' },
    a9: { value: '#43fe3ce6' },
    a10: { value: '#31ff2cda' },
    a11: { value: '#32ff2cda' },
    a12: { value: '#b5feaef5' },
  },

  siis_contrast: {
    gray: { value: '#FFFFFF' },
    darkgray: { value: '#FFFFFF' },
    purple: { value: '#FFFFFF' },
    green: { value: '#162614' },
  },
  siis_surface: {
    gray: { value: '#ffffffcc' },
    darkgray: { value: 'rgba(0, 0, 0, 0.05)' },
    purple: { value: '#fdf5fbcc' },
    green: { value: '#13251180' },
  },
  siis_indicator: {
    gray: { value: '#8b8d98' },
    darkgray: { value: '#696f74' },
    purple: { value: '#9f3995' },
    green: { value: '#3ee738' },
  },
  siis_track: {
    gray: { value: '#8b8d98' },
    darkgray: { value: '#696f74' },
    purple: { value: '#9f3995' },
    green: { value: '#3ee738' },
  },
});

export const semanticColorTokens = defineSemanticTokens.colors({
  app: {
    white: {
      value: {
        base: '#FFFFFF',
      },
    },
    black: {
      value: {
        base: '#000000',
      },
    },
  },
  htmlBackground: {
    value: {
      base: '#EEEEEE',
      _dark: '#333333',
    },
  },
  fg: {
    DEFAULT: {
      value: {
        base: '{colors.siis_grey.12}',
        _dark: '{colors.siis_green.9}',
      },
    },
    accent: {
      DEFAULT: {
        value: {
          base: '{colors.siis_purple}',
          _dark: '#FFFFFF',
        },
      },
    },
  },
  bg: {
    base: {
      DEFAULT: {
        value: {
          base: '{colors.siis_grey.1}',
          _dark: '{colors.siis_darkgrey.1}',
        },
      },
      hover: {
        value: {
          base: '{colors.siis_grey.3}',
          _dark: '{colors.siis_darkgrey.3}',
        },
      },
      active: {
        value: {
          base: '{colors.siis_grey.4}',
          _dark: '{colors.siis_darkgrey.4}',
        },
      },
      border: {
        DEFAULT: {
          value: {
            base: '{colors.siis_grey.6}',
            _dark: '{colors.siis_darkgrey.7}',
          },
        },
      },
    },
    panel: {
      DEFAULT: {
        value: {
          base: '{colors.siis_grey.2}',
          _dark: '{colors.siis_darkgrey.2}',
        },
      },
      hover: {
        value: {
          base: '{colors.siis_grey.3}',
          _dark: '{colors.siis_darkgrey.3}',
        },
      },
      active: {
        value: {
          base: '{colors.siis_grey.4}',
          _dark: '{colors.siis_darkgrey.5}',
        },
      },
    },
  },
});
