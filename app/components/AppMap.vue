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
        :min-zoom="zoom_min"
        :rotation.sync="rotation"
        :center.sync="centre_crs"
      ></vl-view>
      <vl-layer-tile :zIndex=0>
        <vl-source-tile-wms
          ref='base-map'
          :url="basemap_url"
          layers='siis:base_global_full'
          attributions='British Antarctic Survey'
        ></vl-source-tile-wms>
      </vl-layer-tile>

      <vl-layer-tile v-for="layer in layers" :key="layer.layer_id" :opacity=layer.opacity :zIndex=layer.z_index>
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
          <vl-layer-vector :zIndex=9>
            <vl-source-vector :ref=layer.ref :url=layer.url>
              <template v-if="layer.layer_type == 'footprint'">
                  <vl-style-func :function="style_func_footprints"></vl-style-func>
              </template>
            </vl-source-vector>
          </vl-layer-vector>
        </template>
      </div>
      <vl-interaction-select
        :features.sync="selected_features"
        :condition="select_condition"
      >
        <vl-style>
          <vl-style-stroke color="#28A197" :width="2"></vl-style-stroke>
          <vl-style-fill color="rgba(255, 255, 255, 0)"></vl-style-fill>
        </vl-style>
      </vl-interaction-select>
      <vl-layer-graticule :show-labels="false" v-if="show_graticule"></vl-layer-graticule>

      <template v-if="show_ship_position">
        <vl-layer-vector :zIndex=12>
          <vl-source-vector>
            <vl-feature>
              <vl-geom-point :coordinates="ship_position_projected"></vl-geom-point>
              <vl-style>
                <vl-style-circle :radius="5">
                  <vl-style-fill color="#B10E1E"></vl-style-fill>
                  <vl-style-stroke color="#FFFFFF"></vl-style-stroke>
                </vl-style-circle>
              </vl-style>
            </vl-feature>
          </vl-source-vector>
        </vl-layer-vector>
      </template>
      <template v-if="show_ship_track">
        <vl-layer-vector :zIndex=10>
          <vl-source-vector>
            <vl-feature>
              <vl-geom-line-string
                :coordinates="ship_track_projected"
                attributions='British Antarctic Survey'
              ></vl-geom-line-string>
            </vl-feature>
          </vl-source-vector>
        </vl-layer-vector>

        <!-- Retained in case we need to fall back from the WFS based layer for performance reasons -->
        <!-- <vl-layer-tile>
          <vl-source-tile-wms
            ref='ship-track'
            :url="`${this.ogc_endpoint}/geoserver/siis/wms`"
            layers='siis:vw_track_line'
            :style="`siis:vessel_track_line.${this.style_modifier}`"
            attributions='British Antarctic Survey'
          ></vl-source-tile-wms>
        </vl-layer-tile> -->
      </template>

      <template v-if="reference_feature_coordinates_projected.length > 0">
        <vl-layer-vector ref="reference-layer" :zIndex=50>
          <vl-source-vector>
            <vl-feature>
              <vl-geom-line-string :coordinates="reference_feature_coordinates_projected"></vl-geom-line-string>
              <vl-style>
                <vl-style-stroke color="#F47738" :width="2"></vl-style-stroke>
              </vl-style>
            </vl-feature>
          </vl-source-vector>
        </vl-layer-vector>
      </template>

      <template v-if="show_measure_tool">
        <vl-layer-vector :zIndex=100>
          <vl-source-vector
            ref="AppMapDrawingSource"
            ident="drawing-layer"
            :features.sync="drawn_features"
          ></vl-source-vector>
          <vl-style>
            <vl-style-stroke color="green"></vl-style-stroke>
          </vl-style>
        </vl-layer-vector>
        <vl-interaction-draw type="LineString" source="drawing-layer" v-on:drawstart="drawnRouteListener">
          <vl-style>
            <vl-style-stroke color="red"></vl-style-stroke>
            <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
          </vl-style>
        </vl-interaction-draw>
      </template>
    </vl-map>

    <div class="app-map-measures app-panel">
      <div class="app-map-control" id="app-map-measure-scalebar"></div>
      <div class="app-map-control" id="app-map-measure-position"></div>
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
      <p>Drawn features</p>
      <pre>{{ drawn_features }}</pre>
      <p>Layers:</p>
      <pre v-for="layer in layers" :key="layer.name">{{ JSON.stringify(layer) }}</pre>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';
import proj4 from 'proj4';
import {click, never} from 'ol/events/condition';
import {Attribution, FullScreen, MousePosition, ScaleLine, Zoom} from 'ol/control';
import {transform, transformExtent, addProjection} from 'ol/proj'
import {register} from 'ol/proj/proj4';
import {createStringXY} from 'ol/coordinate';
import Projection from 'ol/proj/Projection';
import {getLength} from 'ol/sphere';
import GeoJSON from 'ol/format/GeoJSON';
import VueLayers from 'vuelayers';
import {createStyle} from 'vuelayers/dist/ol-ext'

import {degreesToStringHDDM} from '../mixins.js';
import '../assets/vuelayers.css'

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
  extent: [-4194304, -4194304, 4194304, 4194304],
  worldExtent: [-180, 60, 180, 90]
});
const projection3031 = new Projection({
  code: 'EPSG:3031',
  extent: [-4194304, -4194304, 4194304, 4194304],
  worldExtent: [-180, -90, 180, -60]
});
addProjection(projection3413);
addProjection(projection3031);

const attributionControl = new Attribution({
  collapsible: true,
});
const fullscreenControl = new FullScreen();
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  undefinedHTML: '-,<br/>-',
});
const scaleLineControl = new ScaleLine();
const zoomControl = new Zoom();

export default {
  data() {
    return {
      'layers': [],
      'zoom': 2,
      'zoom_min': 2,
      'centre_crs': [0,0],
      'extent_4326': [0,0,0,0],
      'controls': false,
      'selected_features': [],
      'value_at_pixel_feature': {},
      'drawn_features': [],
      'ship_track': [],
      'draw_feature_listener': null,
    }
  },

  props: [
    'debug_mode',
    'colour_scheme',
    'crs',
    'centre',
    'rotation',
    'product_granules',
    'selected_product_granules',
    'position_format',
    'scale_bar_unit',
    'ogc_endpoint',
    'show_graticule',
    'show_measure_tool',
    'show_ship_position',
    'show_ship_track',
    'ship_position_lat',
    'ship_position_lon',
    'drawn_feature_reset_count',
    'measure_tool_feature_export_count',
    'measure_tool_max_features',
    'reference_feature',
    'time_filter',
  ],

  computed: {
    style_modifier: function () {
      if (this.colour_scheme == 'light' || this.colour_scheme == 'day') {
        return 'day';
      } else if (this.colour_scheme == 'dark' || this.colour_scheme == 'night') {
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
    enable_footprint_selection: function () {
      return !this.show_measure_tool;
    },
    select_condition: function () {
      if (this.enable_footprint_selection === true) {
        return click;
      }
      return never;
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
      if (! ('product' in this.selected_product_granules)) {
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
    },
    drawn_feature: function () {
      if (this.drawn_features.length > 0) {
        return this.drawn_features[this.drawn_features.length - 1];
      }
      return {};
    },
    ship_position_projected: function () {
      if (this.ship_position_lat !== 0 && this.ship_position_lon !== 0) {
        return transform([this.ship_position_lon, this.ship_position_lat], 'EPSG:4326', this.crs);
      }
      return [0,0];
    },
    ship_track_projected: function () {
      if (this.ship_track.length > 0) {
        return this.ship_track;
      }
      return [[0,0]];
    },
    reference_feature_coordinates_projected: function () {
      let coordinates = [];
      let _crs = this.crs;
      if (Array.isArray(this.reference_feature?.geometry?.coordinates)) {
        this.reference_feature.geometry.coordinates.forEach(function(coordinate) {
          coordinates.push(transform(coordinate, 'EPSG:4326', _crs));
        });
      }

      return coordinates;
    },
    basemap_url: function () {
      return `${this.ogc_endpoint}/geoserver/siis/wms`;
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
      this.set_mouse_position_format();
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
      let _value_at_pixel_feature = this.value_at_pixel_feature
      if (this.value_at_pixel_feature.hasOwnProperty('properties')) {
        _value_at_pixel_feature = this.value_at_pixel_feature.properties;
      }
      this.$emit("update:value_at_pixel_feature", _value_at_pixel_feature);
    },
    centre () {
      this.updateCentre();
    },
    drawn_feature_reset_count () {
      // this is a bit of a hack - each time the reset button is clicked, this variable is incremented, which is
      // registered in this method and used as a signal to reset the drawn features - i.e. the value itself is ignored.
      this.resetDrawnFeatures();
    },
    measure_tool_feature_export_count () {
      // this is a bit of a hack - each time the export button is clicked, this variable is incremented, which is
      // registered in this method and used as a signal to export the drawn feature - i.e. the value itself is ignored.
      this.exportDrawnFeature();
    },
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
          'style': `${product_granule.ogc_style}.${this.style_modifier}`,
          'opacity': product_granule.opacity,
          'attribution': product_granule.attribution,
          'layer_type': "default",
          'z_index': product_granule.z_index,
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

            // horrible hack!
            const date_filter = this.calculateTimeFilterAsInterval(product_granule.default_time_filter);
            let date_filter_parameter = '';
            if (date_filter !== false) {
              date_filter_parameter = `&cql_filter=timestamp%20DURING%20${date_filter.start}%2F${date_filter.end}`;
            }

            let footprints_layer = {
              'ref': id,
              'id': id,
              '_id': product_granule.id,
              'protocol': 'wfs',
              'url': `${this.ogc_endpoint}/geoserver/siis/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application%2Fjson&typeName=${footprints_layer_name}&viewparams=p_code:${product_granule.ogc_layer_name.replace(':', '.').replace('_', '.')}${date_filter_parameter}`,
              'layer_type': "footprint"
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

      mousePositionControl.setTarget(document.getElementById('app-map-measure-position'));
      mousePositionControl.setProjection(this.mouse_position_format_projection);
      this.set_mouse_position_format();
      this.$refs.AppMap.$map.addControl(mousePositionControl);

      scaleLineControl.setTarget(document.getElementById('app-map-measure-scalebar'));
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
        // alerts disabled as per https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/199
        // alert('Value at pixel (WMS test) data could not be retrieved');
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
    cleanup_orphaned_layers: function () {
      let _orphaned_layers = [];

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
          _orphaned_layers.push(_index);
        }
      });

      // remove any indexes marked as orphans - this requires `_orphaned_layers` to be sorted in ascending order
      this.layers = this.layers.filter(function(value, index) {
        return _orphaned_layers.indexOf(index) == -1;
      });
    },
    style_func_footprints: function (feature, resolution) {
      let stroke_colour = '#BBDAC0';  // .status-na

      if (feature.values_.status == 'offline') {
        stroke_colour = '#B10E1E';
      }
      else if (feature.values_.status == 'pending') {
        stroke_colour = '#FFBF47';
      }
      else if (feature.values_.status == 'processing') {
        stroke_colour = '#2B8CC4';
      }
      else if (feature.values_.status == 'online') {
        stroke_colour = '#379245';
      }
      else if (feature.values_.status == 'outdated') {
        stroke_colour = '#F47738';
      }
      else if (feature.values_.status == 'hr_requested') {
        stroke_colour = '#B6DFDC';
      }
      else if (feature.values_.status == 'hr_pending') {
        stroke_colour = '#6FC0B9';
      }
      else if (feature.values_.status == 'hr_processing') {
        stroke_colour = '#0E3733';
      }
      else if (feature.values_.status == 'hr_online') {
        stroke_colour = '#28A197';
      }

      let style = createStyle({
        strokeColor: stroke_colour,
        strokeWidth: 2,
      });

      return [style];
    },
    set_mouse_position_format: function() {
      if (this.position_format == 'latlon') {
        mousePositionControl.setCoordinateFormat(this.mouse_position_custom_coordinate_format);
      } else {
        mousePositionControl.setCoordinateFormat(createStringXY(4));
      }
    },
    mouse_position_custom_coordinate_format: function (coordinate) {
      let lat = degreesToStringHDDM('NS', coordinate[1], 3);
      let lon = degreesToStringHDDM('EW', coordinate[0], 3)
      return `Lat: ${lat}<br/>Lon: ${lon}`;
    },
    updateCentre: function () {
      if (this.centre[0] != 0 && this.centre[1] != 0) {
        this.centre_crs = transform(this.centre, 'EPSG:4326', this.crs);
      }
    },
    resetDrawnFeatures: function() {
      this.drawn_features = [];
    },
    drawnRouteListener: function(event) {
      let feature = event.feature;
      let _this = this

      this.draw_feature_listener = feature.getGeometry().on('change', function(geometry_event) {
        const feature_geometry = geometry_event.target;
        const feature_geometry_vertexes = feature_geometry.getCoordinates().length

        _this.$emit("update:drawn_feature_vertexes", feature_geometry_vertexes);
        _this.$emit("update:drawn_feature_length", getLength(feature_geometry));

        // emit warning to user if feature count is nearly 8300, meaning it might produce a file over 1MB when exported
        if (feature_geometry_vertexes >= _this.measure_tool_max_features) {
          alert(`WARNING: Route length is over limit for RTZ export (${_this.measure_tool_max_features}) - export disabled.`)
        }
      });
    },
    exportDrawnFeature: function() {
      if (Object.keys(this.drawn_feature).length === 0) {
        return '';
      } else {
        const feature = this.$refs.AppMapDrawingSource.$source.getFeatures()[0];
        const exporter = new GeoJSON();
        this.$emit("update:drawn_feature_export", exporter.writeFeature(
          feature,
          {dataProjection: 'EPSG:4326', featureProjection: this.crs}
        ));
      }
    },
    getShipTrack: async function() {
      let request_endpoint = this.ogc_endpoint + '/geoserver/siis/ows';
      let request_config = {'params': {
        'service': 'WFS',
        'version': '1.0.0',
        'request': 'GetFeature',
        'typeName': 'siis:vw_track_line',
        'srsName': this.crs,
        'maxFeatures': '1',
        'outputFormat': 'application/json',
      }};

      try {
        const response = await axios.get(request_endpoint, request_config);
        let feature = response.data.features[0];
        this.ship_track = feature.geometry.coordinates;
      } catch (error) {
        // alerts disabled as per https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/199
        // alert('Ship track data could not be retrieved');
        console.error(error);
      }
    },
    calculateTimeFilterAsInterval: function (default_period_hours) {
      if (this.time_filter == '-1') {
        // no filter
        return false;
      } else if (this.time_filter == '0') {
        // default
        return this.calculateDateIntervalFromHours(default_period_hours);
      } else {
        // filter set by app
        return this.calculateDateIntervalFromHours(this.time_filter);
      }
    },
    calculateDateIntervalFromHours: function (hours) {
      const days = Math.floor(hours / 24);
      let interval_start = new Date(new Date().setDate(new Date().getDate()-days));
      let interval_end = new Date();

      interval_start = interval_start.toISOString();
      interval_end = interval_end.toISOString();

      return {
        'start': interval_start,
        'end': interval_end
      }
    },
  },

  async mounted() {
    this.initLayers();

    if (this.show_ship_track) {
      let _this = this;
      setInterval(async function () {
        await _this.getShipTrack();
      }, 30000);
    }

    this.$refs.AppMapView.$createPromise.then(() => {
      this.updateCentre();
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

  .app-map-measures {
    grid-area: map-measures;
    z-index: 10;
  }
</style>

<style>
  #app-map-control-zoom button,
  #app-map-control-fullscreen button {
    display: inline-block;
    width: 30px;
    height: 30px;
  }

  #app-map-measure-scalebar .ol-scale-line {
    position: initial;
    background: none;
  }
  #app-map-measure-scalebar .ol-scale-line .ol-scale-line-inner {
    color: var(--color);
    border-color: var(--color);
  }

  #app-map-measure-position .ol-mouse-position {
    font-family: 'Monaco', 'Consolas', 'Courier New', Courier, monospace;
    position: initial;
  }
</style>