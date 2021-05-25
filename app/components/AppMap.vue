<template>
  <section class="app-map-container">
    <vl-map
      ref="AppMap"
      :data-projection="crs"
      :defaultControls="controls"
      load-tiles-while-animating="true"
      load-tiles-while-interacting="true"
    >
      <vl-view
        ref="AppMapView"
        :projection="crs"
        :zoom.sync="zoom"
        :rotation.sync="rotation"
        :center.sync="centre_crs"
      ></vl-view>
      <vl-layer-tile>
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
    <div class="app-map-controls">
      <div>
        Zoom:
        <div id="app-map-control-zoom"></div>
      </div>
      <div>
        Fullscreen:
        <div id="app-map-control-fullscreen"></div>
      </div>
      <div>
        Current position:
        <div id="app-map-control-position"></div>
      </div>
      <div>
        Rotation reset:
        <div id="app-map-control-rotation"></div>
      </div>
    </div>
    <div class="debug">
      <p>CRS: <output>{{ crs }}</output></p>
      <p>Rotation (radians): <output>{{ rotation }}</output></p>
      <p>Zoom: <output>{{ zoom }}</output></p>
      <p>Centre (CRS): <output>{{ centre_crs }}</output></p>
      <p>Centre (4326): <output>{{ centre_4326 }}</output></p>
      <p>Extent (EPSG:4326): <output>{{ extent_4326 }}</output></p>
      <p>Position format: <output>{{ position_format }}</output></p>
      <p>Scale bar units: <output>{{ scale_bar_unit }}</output></p>
      <pre v-for="layer in layers" :key="layer.name">{{ JSON.stringify(layer) }}</pre>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import proj4 from 'proj4';
import {Attribution, FullScreen, MousePosition, Rotate, ScaleLine, Zoom} from 'ol/control';
import {transform, transformExtent, addProjection} from 'ol/proj'
import {register} from 'ol/proj/proj4';
import {createStringXY} from 'ol/coordinate';
import Projection from 'ol/proj/Projection';
import VueLayers from 'vuelayers';
import 'vuelayers/dist/vuelayers.css';

Vue.use(VueLayers);

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
addProjection(projection3413);
addProjection(projection3031);

const attributionControl = new Attribution({
  collapsible: true,
});
const fullscreenControl = new FullScreen();
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  undefinedHTML: '&nbsp;',
});
const rotationControl = new Rotate();
const scaleLineControl = new ScaleLine();
const zoomControl = new Zoom();

export default {
  data() {
    return {
      'layers': [],
      'zoom': 2,
      'centre_crs': [0,0],
      'extent_4326': [0,0,0,0],
      'controls': false,
    }
  },

  props: [
    'colour_scheme',
    'crs',
    'rotation',
    'product_granules',
    'position_format',
    'scale_bar_unit',
  ],

  computed: {
    style_modifier: function () {
      if (this.colour_scheme == 'light') {
        return 'day';
      } else if (this.colour_scheme == 'dark') {
        return 'night';
      }
    },
    centre_4326: function () {
      return transform(this.centre_crs, this.crs, 'EPSG:4326');
    },
    mouse_position_format_projection: function () {
      if (this.position_format == 'latlon') {
        return 'EPSG:4326';
      }
      return this.crs;
    }
  },

  watch: {
    colour_scheme: function () {
      this.initLayers();
    },
    product_granules: function () {
      this.initLayers();
    },
    zoom () {
      this.updateExtent();
    },
    centre_crs () {
      this.updateExtent();
    },
    position_format () {
      mousePositionControl.setProjection(this.mouse_position_format_projection);
    },
    scale_bar_unit () {
      scaleLineControl.setUnits(this.scale_bar_unit);
    },
  },

  methods: {
    initLayers: function () {
      this.layers = [];

      this.product_granules.forEach((product_granule) => {
        let layer = {
          'protocol': product_granule.ogc_protocol,
          'endpoint': product_granule.ogc_protocol_url,
          'name': product_granule.ogc_layer_name,
          'format': product_granule.ogc_format,
          'style': `${product_granule.ogc_style}-${this.style_modifier}`,
          'attribution': product_granule.attribution
        }

        if (product_granule.has_granules) {
          product_granule.selected_granule_indexes.forEach((granule_index) => {
            let _granule_layer = JSON.parse(JSON.stringify(layer));  // clone base layer properties
            _granule_layer['time'] = product_granule.granules[granule_index].timestamp;
            this.layers.push(_granule_layer);
          });
        } else {
          this.layers.push(layer);
        }
      });
    },
    calcCentre4326: function () {
      this.centre_4326 = transform(this.centre_crs, 'EPSG:4326', this.crs);
    },
    updateExtent: function () {
      if (this.$refs.AppMapView.$view == null) return;
      this.extent_4326 = transformExtent(this.$refs.AppMapView.$view.calculateExtent(), this.crs, 'EPSG:4326');
    }
  },

  mounted() {
    this.initLayers();

    this.$refs.AppMapView.$createPromise.then(() => {
      this.updateExtent();
    });

    this.$refs.AppMap.$createPromise.then(() => {
      this.$refs.AppMap.$map.addControl(attributionControl);

      fullscreenControl.setTarget(document.getElementById('app-map-control-fullscreen'));
      this.$refs.AppMap.$map.addControl(fullscreenControl);

      mousePositionControl.setTarget(document.getElementById('app-map-control-position'));
      mousePositionControl.setProjection(this.mouse_position_format_projection);
      this.$refs.AppMap.$map.addControl(mousePositionControl);

      rotationControl.setTarget(document.getElementById('app-map-control-rotation'));
      this.$refs.AppMap.$map.addControl(rotationControl);

      scaleLineControl.setUnits(this.scale_bar_unit);
      this.$refs.AppMap.$map.addControl(scaleLineControl);

      zoomControl.setTarget(document.getElementById('app-map-control-zoom'));
      this.$refs.AppMap.$map.addControl(zoomControl);
    });
  }
}
</script>

<style scoped>
  .app-map-container {
    display: contents;
  }

  .app-map-controls {
    grid-area: map-controls;
    border-right: 1px solid orchid;
    border-bottom: 1px solid orchid;
    z-index: 10;
  }

  .vl-map {
    grid-row-start: map-controls;
    grid-column-start: map-controls;
    grid-row-end: x-bottom-right;
    grid-column-end: x-bottom-right;
    width: 100%;
    height: 100vh;
    z-index: 1;
  }
  .vl-map .ol-rotate {
    top: 3em;
  }

  .debug {
    grid-row-start: x-bottom-left;
    grid-column-start: x-bottom-left;
    grid-row-end: x-bottom-right;
    grid-column-end: x-bottom-right;
    border: 1px solid red;
    padding: 4px;
    z-index: 10;
    overflow-x: scroll;
  }
</style>

<style>
  .app-map-controls .ol-control,
  .app-map-controls .ol-mouse-position {
    position: static;
  }
</style>