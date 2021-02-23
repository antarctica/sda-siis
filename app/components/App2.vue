<template>
  <div id="app-wrapper">
    <app-colour-scheme
      :colour_scheme=colour_scheme
      v-on:update:system_colour_scheme="whenSystemColourSchemeChange"
    ></app-colour-scheme>
    <div id="panels-wrapper">
      <div class="panel" id="layer-wrapper">
        <app-product-switcher
          :api_endpoint="api_endpoint"
          :ogc_endpoint="ogc_endpoint"
          :crs="control_crs"
          v-on:update:selected_product_granule="whenSelectedProductGranuleChange"
          v-on:update:active_product_granules="whenActiveProductGranulesChange"
        ></app-product-switcher>
      </div>
      <div class="panel" id="map-controls-wrapper">
        <app-map-controls
          :initial_crs="control_crs"
          initial_day_night_mode="system"
          v-on:update:crs="whenCRSChange"
          v-on:update:day_night="whenColourSchemeChange"
        ></app-map-controls>
      </div>
      <div class="panel" id="granule-metadata-wrapper">
        <app-granule-metadata
          :selected_product_granule="selected_product_granule"
        ></app-granule-metadata>
      </div>
      <div class="panel" id="sensor-wrapper">
        <app-sensor-metadata></app-sensor-metadata>
      </div>
    </div>
    <div class="map" id="map-wrapper">
      <app-map2
        :colour_scheme=resolved_colour_scheme
        :crs="control_crs"
        :product_granules="active_product_granules"
      ></app-map2>
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
import AppMap2 from './AppMap2.vue';
import '../assets/main.css'

export default Vue.extend({
  name: "App",

  data() {
    return {
      environment: 'development',
      colour_scheme: 'system',
      system_colour_scheme: '',
      control_crs: 'EPSG:3413',
      selected_product_granule: {},
      active_product_granules: []
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
    AppMap2
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
    whenSelectedProductGranuleChange: function ($event) {
      this.selected_product_granule = $event;
    },
    whenActiveProductGranulesChange: function ($event) {
      this.active_product_granules = $event;
    }
  }
});
</script>

<style scoped>
  #panels-wrapper {
    display: flex;
  }
  .panel {
    flex-grow: 1;
    border: 1px solid green;
    border-right: none;
    padding: 4px;
  }
  .panel:last-of-type {
    border-right: 1px solid green;
  }

  .map {
    width: 100%;
  }
</style>