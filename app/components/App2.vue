<template>
  <div id="app-wrapper">
    <app-colour-scheme :colour_scheme=preferences.colour_scheme></app-colour-scheme>
    <div id="panels-wrapper">
      <div class="panel" id="layer-wrapper">
        <app-product-switcher
          :api_endpoint="api_endpoint"
          :crs="control_crs"
          v-on:update:selected_product_granule="whenSelectedProductGranuleChange"
        ></app-product-switcher>
      </div>
      <div class="panel" id="map-controls-wrapper">
        <app-map-controls
          :initial_crs="control_crs"
          v-on:update:crs="whenCRSChange"
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
        :crs="control_crs"
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
      preferences: {
        colour_scheme: 'system'
      },
      control_crs: 'EPSG:3413',
      selected_product_granule: {}
    }
  },

  computed: {
    api_endpoint: function () {
      return process.env.SERVICE_API_ENDPOINT;
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
    whenCRSChange: function ($event) {
      this.control_crs = $event;
    },
    whenSelectedProductGranuleChange: function ($event) {
      this.selected_product_granule = $event;
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