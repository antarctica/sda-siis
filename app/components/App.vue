<template>
  <div id="app-wrapper">
    <app-colour-scheme
      :colour_scheme=colour_scheme
      v-on:update:system_colour_scheme="whenSystemColourSchemeChange"
    ></app-colour-scheme>
    <div class="grid-container">
      <app-map
        :debug_mode="debug_mode"
        :colour_scheme=resolved_colour_scheme
        :crs="control_crs"
        :rotation="rotation_radians"
        :product_granules="active_product_granules"
        :selected_product_granules="selected_product_granules"
        :centre="map_centre"
        :position_format="position_format"
        :scale_bar_unit="scale_bar_unit"
        :ogc_endpoint="ogc_endpoint"
        :show_graticule="show_graticule"
        :show_measure_tool="show_measure_tool"
        :show_ship_position="show_ship_position"
        :show_ship_track="show_ship_track"
        :ship_position_lat="ship_position_lat"
        :ship_position_lon="ship_position_lon"
        :drawn_feature_reset_count="measure_tool_feature_reset_count"
        :measure_tool_feature_export_count="measure_tool_feature_export_count"
        :measure_tool_max_features="measure_tool_max_features"
        :reference_feature="reference_feature"
        v-on:update:selected_footprints="whenSelectedFootprintsChange"
        v-on:update:value_at_pixel_feature="whenValueAtPixelFeatureChanges"
        v-on:update:drawn_feature="whenDrawnFeatureChanges"
        v-on:update:drawn_feature_length="whenDrawnFeatureLengthChanges"
        v-on:update:drawn_feature_export="whenDrawnFeatureExportChanges"
      ></app-map>
      <app-product-switcher
        :display_ui="display_ui"
        :debug_mode="debug_mode"
        :api_endpoint="api_endpoint"
        :ogc_endpoint="ogc_endpoint"
        :crs="control_crs"
        :selected_footprints="selected_footprints"
        v-on:update:selected_product_granules="whenSelectedProductGranulesChange"
        v-on:update:active_product_granules="whenActiveProductGranulesChange"
      ></app-product-switcher>
      <app-map-controls
        initial_day_night_mode="day"
        :api_endpoint="api_endpoint"
        :initial_crs="control_crs"
        :debug_mode="debug_mode"
        :rotation_heading="rotation_heading"
        :rotation_longitude="rotation_longitude"
        :sensor_position="sensor_position"
        :measure_tool_feature_count="measure_tool_feature_count"
        :measure_tool_feature_length="measure_tool_feature_length"
        :measure_tool_feature_geojson="measure_tool_feature_geojson"
        :measure_tool_max_features="measure_tool_max_features"
        v-on:update:crs="whenCRSChange"
        v-on:update:display_ui="whenDisplayUIChange"
        v-on:update:debug_mode="whenDebugModeChange"
        v-on:update:day_night="whenColourSchemeChange"
        v-on:update:rotation_radians="whenRotationRadiansChange"
        v-on:update:position_format="whenPositionFormatChange"
        v-on:update:scale_bar_unit="whenScaleBarUnitChange"
        v-on:update:map_centre="whenMapCentreChange"
        v-on:update:show_graticule="whenShowGraticuleChange"
        v-on:update:show_measure_tool="whenShowMeasureToolChange"
        v-on:update:reset_drawn_feature="whenDrawnFeatureReset"
        v-on:update:export_drawn_feature="whenDrawnFeatureExport"
        v-on:update:show_ship_position="whenShowShipPositionChange"
        v-on:update:show_ship_track="whenShowShipTrackChange"
        v-on:update:import_reference_feature="whenImportReferenceFeatureChange"
      ></app-map-controls>
      <app-granule-metadata
        :display_ui="display_ui"
        :selected_product_granules="selected_product_granules"
        :value_at_pixel_feature="value_at_pixel_feature"
      ></app-granule-metadata>
      <app-sensor-metadata
        :display_ui="display_ui"
        :debug_mode="debug_mode"
        :ogc_endpoint="ogc_endpoint"
        v-on:update:sensor_position_latitude="whenShipPositionLatitudeChange"
        v-on:update:sensor_position_longitude="whenShipPositionLongitudeChange"
        v-on:update:sensor_rotation_heading="whenRotationHeadingChange"
        v-on:update:sensor_rotation_longitude="whenRotationLongitudeChange"
        v-on:update:sensor_position="whenSensorPositionChange"
      ></app-sensor-metadata>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import "@fontsource/open-sans";

import AppColourScheme from './AppColourScheme.vue';
import AppProductSwitcher from './AppProductSwitcher.vue';
import AppMapControls from './AppMapControls.vue';
import AppGranuleMetadata from './AppGranuleMetadata.vue';
import AppSensorMetadata from './AppSensorMetadata.vue';
import AppMap from './AppMap.vue';
import '../assets/main.css'

export default Vue.extend({
  name: "App",

  data() {
    return {
      environment: 'development',
      display_ui: true,
      debug_mode: false,
      colour_scheme: 'day',
      system_colour_scheme: '',
      control_crs: 'EPSG:3031',
      selected_product_granules: {},
      active_product_granules: [],
      selected_footprints: [],
      value_at_pixel_feature: {},
      rotation_heading: 0,
      rotation_longitude: 0,
      rotation_radians: 0,
      position_format: 'latlon',
      scale_bar_unit: 'nautical',
      sensor_position: [0,0],
      map_centre: [0,0],
      show_graticule: true,
      show_measure_tool: false,
      show_ship_position: false,
      show_ship_track: false,
      ship_position_lat: 0,
      ship_position_lon: 0,
      measure_tool_feature_count: 0,
      measure_tool_feature_length: 0,
      measure_tool_feature_reset_count: 0,
      measure_tool_feature_export_count: 0,
      measure_tool_feature_geojson: '',
      measure_tool_max_features: 8300,
      reference_feature: {},
    }
  },

  computed: {
    api_endpoint: function () {
      return process.env.SERVICE_API_ENDPOINT;
    },
    ogc_endpoint: function () {
      return process.env.SERVICE_API_OGC_ENDPOINT;
    },
    resolved_colour_scheme: function () {
      if (this.colour_scheme == 'system') {
        return this.system_colour_scheme;
      }
      return this.colour_scheme;
    }
  },

  components: {
    AppColourScheme,
    AppProductSwitcher,
    AppMapControls,
    AppGranuleMetadata,
    AppSensorMetadata,
    AppMap
  },

  methods: {
    whenDisplayUIChange: function ($event) {
      this.display_ui = $event;
    },
    whenDebugModeChange: function ($event) {
      this.debug_mode = $event;
    },
    whenDayNightChange: function ($event) {
      if ($event == 'system') {
        this.colour_scheme = 'system';
      } else if ($event == 'day') {
        this.colour_scheme = 'light';
      } else if ($event == 'night') {
        this.colour_scheme = 'dark';
      }
    },
    whenSystemColourSchemeChange: function ($event) {
      this.system_colour_scheme = $event;
    },
    whenColourSchemeChange: function ($event) {
      this.colour_scheme = $event;
    },
    whenCRSChange: function ($event) {
      this.control_crs = $event;
    },
    whenSelectedProductGranulesChange: function ($event) {
      this.selected_product_granules = $event;
    },
    whenActiveProductGranulesChange: function ($event) {
      this.active_product_granules = $event;
    },
    whenRotationHeadingChange: function ($event) {
      this.rotation_heading = $event;
    },
    whenRotationLongitudeChange: function ($event) {
      this.rotation_longitude = $event;
    },
    whenRotationRadiansChange: function ($event) {
      this.rotation_radians = $event;
    },
    whenPositionFormatChange: function ($event) {
      this.position_format = $event;
    },
    whenScaleBarUnitChange: function ($event) {
      this.scale_bar_unit = $event;
    },
    whenSelectedFootprintsChange: function ($event) {
      this.selected_footprints = $event;
    },
    whenValueAtPixelFeatureChanges: function ($event) {
      this.value_at_pixel_feature = $event;
    },
    whenSensorPositionChange: function ($event) {
      this.sensor_position = $event;
    },
    whenMapCentreChange: function ($event) {
      this.map_centre = $event;
    },
    whenShowGraticuleChange: function ($event) {
      this.show_graticule = $event;
    },
    whenShowMeasureToolChange: function ($event) {
      this.show_measure_tool = $event;
    },
    whenShowShipPositionChange: function ($event) {
      this.show_ship_position = $event;
    },
    whenShowShipTrackChange: function ($event) {
      this.show_ship_track = $event;
    },
    whenShipPositionLatitudeChange: function ($event) {
      this.ship_position_lat = $event;
    },
    whenShipPositionLongitudeChange: function ($event) {
      this.ship_position_lon = $event;
    },
    whenDrawnFeatureChanges: function ($event) {
      if (Object.keys($event).length === 0) {
        this.measure_tool_feature_count = 0;
      } else {
        this.measure_tool_feature_count = $event.geometry.coordinates.length;
      }
    },
    whenDrawnFeatureLengthChanges: function ($event) {
      this.measure_tool_feature_length = $event;
    },
    whenDrawnFeatureReset: function ($event) {
      this.measure_tool_feature_reset_count += 1;
    },
    whenDrawnFeatureExport: function ($event) {
      this.measure_tool_feature_export_count += 1;
    },
    whenDrawnFeatureExportChanges: function ($event) {
      this.measure_tool_feature_geojson = $event;
    },
    whenImportReferenceFeatureChange: function ($event) {
      this.reference_feature = $event;
    },
  }
});
</script>

<style scoped>
  .grid-container {
    display: grid;

    grid-template-columns: 11% auto 15% 20%;
    grid-template-rows: min-content auto 64px 30px;
    grid-template-areas:
      "sensor-metadata .            granule-metadata products-switcher"
      ".               .            .                .                "
      "map-measures    .            .                .                "
      "map-controls    map-controls map-controls     map-controls     ";
    gap: 15px 15px;
    height: 100vh;
  }
</style>
