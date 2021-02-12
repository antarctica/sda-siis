<template>
  <div id="app-wrapper">
    <app-colour-scheme :colour_scheme=preferences.colour_scheme></app-colour-scheme>
    <div id="panels-wrapper">
      <div class="panel" id="layer-wrapper">layers</div>
      <div class="panel" id="map-controls-wrapper">map controls</div>
      <div class="panel" id="map-metadata-wrapper">map metadata</div>
      <div class="panel" id="granule-metadata-wrapper">granule metadata</div>
      <div class="panel" id="sensor-wrapper">sensor metadata</div>
    </div>
    <div class="map" id="map-wrapper">map</div>
  </div>
</template>

<script>
import Vue from 'vue';
import AppColourScheme from './AppColourScheme.vue';
import '../assets/main.css'

export default Vue.extend({
  name: "App",

  data() {
    return {
      environment: 'development',
      preferences: {
        colour_scheme: 'system'
      }
    }
  },

  components: {
    AppColourScheme
  },
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