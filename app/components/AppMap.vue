<template>
  <section class="app-map-container">
    <vl-map
      ref="AppMap"
      :data-projection="crs"
      :defaultControls="controls"
      load-tiles-while-animating="true"
      load-tiles-while-interacting="true"
      class="app-map"
      @click="onMapClick"
    >
      <vl-view
        ref="AppMapView"
        :projection="crs"
        :zoom.sync="zoom"
        :rotation.sync="rotation"
        :center.sync="centre_crs"
      ></vl-view>
      <vl-layer-tile :zIndex=0>
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>

      <vl-layer-tile v-for="layer in layers" :key="layer.layer_id" :opacity=layer.opacity :zIndex=1>
        <template v-if="layer.protocol === 'wms' || layer.protocol === 'wmts'">
          <!-- WMTS layers are considereed to use WMS until https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/51 is resolved -->
          <!-- <vl-source-wmts
            :ref=layer.ref
            :url=layer.endpoint
            :layerName=layer.name
            :styleName=layer.style
            :format=layer.format
            :matrixSet=crs
            :attributions=layer.attribution
          ></vl-source-wmts> -->
          <vl-source-tile-wms
            :ref=layer.ref
            :url=layer.endpoint
            :layers=layer.name
            :time=layer.time
            :attributions=layer.attribution
          ></vl-source-tile-wms>
        </template>
      </vl-layer-tile>
      <div v-for="layer in layers" :key="layer.layer_id" :opacity=layer.opacity>
        <template v-if="layer.protocol === 'wfs'">
          <vl-layer-vector :zIndex=5>
            <vl-source-vector :ref=layer.ref :url=layer.url></vl-source-vector>
          </vl-layer-vector>
        </template>
      </div>

      <vl-interaction-select
        :features.sync="selected_features"
        :condition="select_condition"
      ></vl-interaction-select>
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

    <div class="debug" v-if="debug_mode">
      <p>CRS: <output>{{ crs }}</output></p>
      <p>Rotation (radians): <output>{{ rotation }}</output></p>
      <p>Zoom: <output>{{ zoom }}</output></p>
      <p>Centre (CRS): <output>{{ centre_crs }}</output></p>
      <p>Centre (4326): <output>{{ centre_4326 }}</output></p>
      <p>Extent (EPSG:4326): <output>{{ extent_4326 }}</output></p>
      <p>Position format: <output>{{ position_format }}</output></p>
      <p>Scale bar units: <output>{{ scale_bar_unit }}</output></p>
      <p>Selected features:</p>
      <pre>{{ selected_features }}</pre>
      <p>Selected footprints:</p>
      <pre>{{ selected_footprints }}</pre>
      <p>selected feature (for value at pixel)</p>
      <pre>{{ selected_value_at_pixel_feature }}</pre>
      <p>Value at pixel feature</p>
      <pre>{{ value_at_pixel_feature }}</pre>
      <p>Layers:</p>
      <pre v-for="layer in layers" :key="layer.name">{{ JSON.stringify(layer) }}</pre>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';
import proj4 from 'proj4';
import {click} from 'ol/events/condition';
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
      'selected_features': [],
      'value_at_pixel_feature': {}
    }
  },

  props: [
    'debug_mode',
    'colour_scheme',
    'crs',
    'rotation',
    'product_granules',
    'selected_product_granules',
    'position_format',
    'scale_bar_unit',
    'ogc_endpoint'
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
    },
    select_condition: function () {
    	return click;
    },
    selected_footprints: function () {
      let granule_features = []
      this.selected_features.forEach((feature) => {
        if (feature.id.startsWith('footprints')) {
          granule_features.push({
            'product_id': feature.properties.code,
            'granule_id': feature.properties.uuid
          })
        }
      });

      return granule_features;
    },
    selected_value_at_pixel_feature: function () {
      if (!('product' in this.selected_product_granules)) {
        return {};
      }
      if (! this.selected_product_granules.product.supports_value_at_pixel) {
        return {};
      }
      if (this.selected_features < 1) {
        return {};
      }

      // workaround inconsistencies between product code syntax (e.g. `siis.ic-nor.s` should become `ic_nor_s`)
      let product_layer_name = this.selected_product_granules.product.code;
      product_layer_name = product_layer_name.replace('siis.', '').replaceAll('.', '_').replaceAll('-', '_');

      // assume only one feature can be selected at once
      if (! this.selected_features[0]['id'].startsWith(product_layer_name)) {
        return {}
      }

      return this.selected_features[0];
    }
  },

  watch: {
    colour_scheme: function () {
      this.initLayers();
    },
    product_granules: {
      deep: true,

      handler() {
        this.initLayers();
      }
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
    selected_footprints () {
      this.$emit("update:selected_footprints", this.selected_footprints);
    },
    selected_value_at_pixel_feature () {
      this.value_at_pixel_feature = this.selected_value_at_pixel_feature;
    },
    value_at_pixel_feature () {
      this.$emit("update:value_at_pixel_feature", this.value_at_pixel_feature.properties);
    }
  },

  methods: {
    initLayers: function () {
      this.product_granules.forEach((product_granule) => {
        let layer = {
          'ref': this.generateLayerRef(product_granule.code),
          'id': product_granule.id,
          'protocol': product_granule.ogc_protocol,
          'endpoint': product_granule.ogc_protocol_url,
          'name': product_granule.ogc_layer_name,
          'format': product_granule.ogc_format,
          'style': `${product_granule.ogc_style}-${this.style_modifier}`,
          'opacity': product_granule.opacity,
          'attribution': product_granule.attribution
        }
        if (! product_granule.has_granules) {
          this.add_or_update_layer(layer);
        }

        if (product_granule.has_granules) {
          product_granule.selected_granule_indexes.forEach((granule_index) => {
            let _granule_layer = JSON.parse(JSON.stringify(layer));  // clone base layer properties
            let _granule = product_granule.granules[granule_index];
            // replace product ID with granule ID for layer ID
            _granule_layer['ref'] = this.generateLayerRef(layer.id, _granule.id);
            _granule_layer['id'] = _granule.id;
            _granule_layer['time'] = _granule.timestamp;
            layer = _granule_layer

            this.add_or_update_layer(layer);
          });

          if (product_granule.granules_selection_mode === 'multiple') {
            const footprints_layer_name = 'siis:footprints';
            const id = `footprints-${product_granule.id}`;
            let footprints_layer = {
              'ref': id,
              'id': id,
              '_id': product_granule.id,
              'protocol': 'wfs',
              'url': `${this.ogc_endpoint}/geoserver/siis/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application%2Fjson&typeName=${footprints_layer_name}&viewparams=p_code:${product_granule.ogc_layer_name.replace(':', '.').replace('_', '.')}`
            };
            this.add_or_update_layer(footprints_layer);
          }
        }
      });

      this.cleanup_orphaned_layers();
      this.$forceUpdate();
    },
    initControls: function () {
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
    },
    calcCentre4326: function () {
      this.centre_4326 = transform(this.centre_crs, 'EPSG:4326', this.crs);
    },
    updateExtent: function () {
      if (this.$refs.AppMapView.$view == null) return;
      this.extent_4326 = transformExtent(this.$refs.AppMapView.$view.calculateExtent(), this.crs, 'EPSG:4326');
    },
    onMapClick: async function (event) {
      // try to get reference to WMS layer for selected product/granule if it supports value at pixel
      if (!('product' in this.selected_product_granules)) {
        return {};
      }
      if (! this.selected_product_granules.product.supports_value_at_pixel) {
        return {};
      }
      let _reference = this.generateLayerRef(this.selected_product_granules.product.id);
      if ('granules' in this.selected_product_granules && this.selected_product_granules.granules.length > 0) {
       _reference = this.generateLayerRef(this.selected_product_granules.product.id, this.selected_product_granules.granules[0].id);
      }
      if (typeof(this.$refs[_reference]) === 'undefined') {
        return {}
      }

      try {
        let request_uri = await this.$refs[_reference][0].getFeatureInfoUrl(
          event.coordinate,
          undefined,
          undefined,
          {'INFO_FORMAT': 'application/json'}
        );
        const response = await axios.get(request_uri);
        // assume only one feature will be returned
        this.value_at_pixel_feature = response.data.features[0];
      } catch (error) {
        console.error('Value at pixel (WMS test) data could not be retrieved');
        console.error(error);
      }
      return {};
    },
    generateLayerRef: function (product_id, granule_id) {
      let _id = product_id;
      if (typeof granule_id !== "undefined") {
        _id = `${_id}___${granule_id}`;
      }

      return _id;
    },
    add_or_update_layer: function (layer) {
      let _index = this.layers.findIndex(_layer => _layer.id === layer.id);
      if (_index === -1) {
        this.layers.push(layer);
      } else {
        this.layers[_index] = layer;
      }
    },
    cleanup_orphaned_layers: function() {
      this.layers.forEach((layer) => {
        let _index = this.product_granules.findIndex(_layer => _layer.id === layer.id);
        if (layer.ref.includes('___')) {
          // assume layer is for a product granule
          let _product_id = layer.ref.split('___')[0];
          let _product_index = this.product_granules.findIndex(_product => _product.id === _product_id);
          if (_product_index !== -1) {
            let _product = this.product_granules[_product_index];
            let _granule_index = _product.granules.findIndex(_granule => _granule.id === layer.id);
            if (_granule_index !== -1) {
              if (_product.selected_granule_indexes.includes(_granule_index)) {
                _index = 999;
              }
            }
          }
        }
        if (layer.id.startsWith('footprints-')) {
          _index = this.product_granules.findIndex(_layer => _layer.id === layer._id);
        }

        if (_index === -1) {
          _index = this.layers.findIndex(_layer => _layer.id === layer.id);
          this.layers.splice(_index, 1);
        }
      });
    }
  },

  mounted() {
    this.initLayers();

    this.$refs.AppMapView.$createPromise.then(() => {
      this.updateExtent();
    });

    this.$refs.AppMap.$createPromise.then(() => {
      this.initControls();
    });
  }
}
</script>

<style scoped>
  .app-map-container {
    display: contents;
  }

  .app-map {
    grid-column: 1/ span 4;
    grid-row: 1/ span 5;
    width: 100%;
    height: 100vh;
    z-index: 1;
  }

  .app-map-controls {
    grid-area: map-controls;
    border-right: 1px solid orchid;
    border-bottom: 1px solid orchid;
    z-index: 10;
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