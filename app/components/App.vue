<template>
  <div id="app-wrapper">
    <app-colour-scheme
      :colour_scheme=colour_scheme
      v-on:update:system_colour_scheme="whenSystemColourSchemeChange"
    ></app-colour-scheme>
    <div class="grid-container">
      <div class="one-third">
          <app-product-switcher
            :api_endpoint="api_endpoint"
            :ogc_endpoint="ogc_endpoint"
            :crs="control_crs"
            v-on:update:selected_product_granules="whenSelectedProductGranulesChange"
            v-on:update:active_product_granules="whenActiveProductGranulesChange"
          ></app-product-switcher>
      </div>
      <div class="two-thirds">
        <app-map
          :colour_scheme=resolved_colour_scheme
          :crs="control_crs"
          :rotation="rotation_radians"
          :product_granules="active_product_granules"
          :position_format="position_format"
          :scale_bar_unit="scale_bar_unit"
          :ogc_endpoint="ogc_endpoint"
        ></app-map>
      </div>
      <div class="two-thirds">
        <app-map-controls
          :initial_crs="control_crs"
          initial_day_night_mode="system"
          :rotation_heading="rotation_heading"
          :rotation_longitude="rotation_longitude"
          v-on:update:crs="whenCRSChange"
          v-on:update:day_night="whenColourSchemeChange"
          v-on:update:rotation_radians="whenRotationRadiansChange"
          v-on:update:position_format="whenPositionFormatChange"
          v-on:update:scale_bar_unit="whenScaleBarUnitChange"
        ></app-map-controls>
        <app-granule-metadata
          :selected_product_granules="selected_product_granules"
        ></app-granule-metadata>
        <app-sensor-metadata
          :ogc_endpoint="ogc_endpoint"
          v-on:update:sensor_rotation_heading="whenRotationHeadingChange"
          v-on:update:sensor_rotation_longitude="whenRotationLongitudeChange"
        ></app-sensor-metadata>
      </div>
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
      colour_scheme: 'system',
      system_colour_scheme: '',
      control_crs: 'EPSG:3413',
      selected_product_granules: {},
      active_product_granules: [],
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
    }
  }
});
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1fr;
    gap: 0px 0px;
    grid-template-areas:
      "one-third two-thirds";
  }

  .one-third { grid-area: one-third; }

  .two-thirds {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
      "map-controls map-controls2 granule-metadata"
      ". map-controls2 granule-metadata"
      ". . ."
      ". . sensor-metadata"
      "x-bottom-left . x-bottom-right";
    grid-area: two-thirds;
    height: 100vh;
  }
</style>