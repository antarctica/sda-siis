import 'ol/ol.css';

import Map from 'ol/Map';
import View from 'ol/View';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import TileLayer from 'ol/layer/Tile';
import {TileDebug} from 'ol/source';
import {ScaleLine, defaults as defaultControls} from 'ol/control';
import Projection from 'ol/proj/Projection';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

proj4.defs(
  'EPSG:3413',
  '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);
proj4.defs(
  'EPSG:3031',
  '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);
register(proj4);

const projection3413 = new Projection({
  code: 'EPSG:3413',
  extent: [-4194304, -4194304, 4194304, 4194304]
});
const projection3031 = new Projection({
  code: 'EPSG:3031',
  extent: [-12367396.2185, -12367396.2185, 12367396.2185, 12367396.2185]
});

const layer1 = new ImageLayer({
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/ows',
    params: {
      'LAYERS': 'base_n',
      'FORMAT': 'image/png',
    },
    serverType: 'geoserver',
  }),
});
const layer2 = new ImageLayer({
  source: new ImageWMS({
    url: 'http://localhost:8080/geoserver/ows',
    params: {
      'LAYERS': 'base_s',
      'FORMAT': 'image/png',
    },
    serverType: 'geoserver',
  }),
});


const map1 = new Map({
  target: 'map1',
  controls: defaultControls().extend([new ScaleLine()]),
  layers: [
    layer1,
    new TileLayer({
      source: new TileDebug(),
    })
  ],
  view: new View({
    projection: projection3413,
    center: [0, 0],
    zoom: 1
  }),
});

const map2 = new Map({
  target: 'map2',
  controls: defaultControls().extend([new ScaleLine()]),
  layers: [
    layer2,
    new TileLayer({
      source: new TileDebug(),
    })
  ],
  view: new View({
    projection: projection3031,
    center: [0, 0],
    zoom: 1
  }),
});
