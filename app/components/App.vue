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
        :position_format="position_format"
        :scale_bar_unit="scale_bar_unit"
        :ogc_endpoint="ogc_endpoint"
        v-on:update:selected_footprints="whenSelectedFootprintsChange"
        v-on:update:value_at_pixel_feature="whenValueAtPixelFeatureChanges"
      ></app-map>
      <app-product-switcher
        :debug_mode="debug_mode"
        :api_endpoint="api_endpoint"
        :ogc_endpoint="ogc_endpoint"
        :crs="control_crs"
        :selected_footprints="selected_footprints"
        v-on:update:selected_product_granules="whenSelectedProductGranulesChange"
        v-on:update:active_product_granules="whenActiveProductGranulesChange"
      ></app-product-switcher>
      <app-map-controls
        :initial_crs="control_crs"
        :debug_mode="debug_mode"
        initial_day_night_mode="system"
        :rotation_heading="rotation_heading"
        :rotation_longitude="rotation_longitude"
        v-on:update:crs="whenCRSChange"
        v-on:update:debug_mode="whenDebugModeChange"
        v-on:update:day_night="whenColourSchemeChange"
        v-on:update:rotation_radians="whenRotationRadiansChange"
        v-on:update:position_format="whenPositionFormatChange"
        v-on:update:scale_bar_unit="whenScaleBarUnitChange"
      ></app-map-controls>
      <app-granule-metadata
        :selected_product_granules="selected_product_granules"
        :value_at_pixel_feature="value_at_pixel_feature"
      ></app-granule-metadata>
      <app-sensor-metadata
        :debug_mode="debug_mode"
        :ogc_endpoint="ogc_endpoint"
        v-on:update:sensor_rotation_heading="whenRotationHeadingChange"
        v-on:update:sensor_rotation_longitude="whenRotationLongitudeChange"
      ></app-sensor-metadata>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

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
      debug_mode: true,
      colour_scheme: 'system',
      system_colour_scheme: '',
      control_crs: 'EPSG:3413',
      selected_product_granules: {},
      active_product_granules: [],
      selected_footprints: [],
      value_at_pixel_feature: {},
      rotation_heading: 0,
      rotation_longitude: 0,
      rotation_radians: 0,
      position_format: 'latlon',
      scale_bar_unit: 'nautical'
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
    whenDebugModeChange: function ($event) {
      this.debug_mode = $event;
      console.log('bar');
      console.log($event);
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
    }
  }
});
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
      "products-switcher map-controls map-controls2 granule-metadata"
      "products-switcher . map-controls2 granule-metadata"
      "products-switcher . . ."
      "products-switcher . . sensor-metadata"
      "x-bottom-left . . x-bottom-right";
    height: 100vh;
  }
</style>