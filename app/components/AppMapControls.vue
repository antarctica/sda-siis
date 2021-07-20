<template>
  <section class="app-map-controls">
    <button v-on:click="debug_control = !debug_control">Toggle Debug Mode</button>
    <fieldset>
      <label for="day-night-mode">Day/Night mode</label>
      <select id="day-night-mode" v-model="day_night_mode" @change="onDayNightChange($event)">
        <option value="system">Automatic (system)</option>
        <option value="day">Day (light)</option>
        <option value="night">Night (dark)</option>
      </select>
    </fieldset>
    <fieldset>
      <label for="map-crs">CRS (Projection)</label>
      <select id="map-crs" v-model="crs" @change="onCRSChange($event)">
        <option value="EPSG:3031">WGS84 Antarctic Polar Stereographic</option>
        <option value="EPSG:3413">WGS84 NSIDC Sea Ice Polar Stereographic North</option>
        <option value="EPSG:3857">WGS84 Pseudo-Mercator</option>
      </select>
    </fieldset>
    <fieldset>
      <label for="map-rotation-source">Rotation source</label>
      <select id="map-rotation-source" v-model="rotation_source" @change="onRotationSourceChange($event)">
        <option value="manual">Manual</option>
        <option value="heading" v-if="crs !== 'EPSG:3857'">Track ship heading</option>
        <option value="longitude" v-if="crs !== 'EPSG:3857'">Track ship longitude</option>
      </select>
      <input
        type="number"
        min="-180"
        max="180"
        step=".01"
        v-model.number="rotation_degrees"
        :disabled="rotation_control_disabled"
      >
    </fieldset>
    <fieldset>
      <label for="map-position-format">Position format</label>
      <select id="map-position-format" v-model="position_format" @change="onPositionFormatChange($event)">
        <option value=latlon>Lat Lon</option>
        <option value=xy>XY (Projected)</option>
      </select>
    </fieldset>
    <fieldset>
      <label for="scale-bar-unit">Scale bar unit</label>
      <select id="scale-bar-unit" v-model="scale_bar_unit" @change="onScaleBarUnitChange($event)">
        <option value=nautical>Nautical miles (nm)</option>
        <option value=metric>Metric (m, km)</option>
      </select>
    </fieldset>
    <div class="debug" v-if="debug_mode">
      <p>Debug mode: <output>{{ debug_control }}</output></p>
      <p>Day/Night mode: <output>{{ day_night_mode }}</output></p>
      <p>CRS: <output>{{ crs }}</output><p>
      <p>Rotation source: <output>{{ rotation_source }}</output></p>
      <p>Rotation value (degrees): <output>{{ rotation_degrees }}</output></p>
      <p>Rotation value (radians): <output>{{ rotation_radians }}</output></p>
      <p>Position format: <output>{{ position_format }}</output></p>
      <p>Scale bar units: <output>{{ scale_bar_unit }}</output></p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      'crs': 'EPSG:3413',
      'debug_control': false,
      'day_night_mode': 'system',
      'rotation_source': 'manual',
      'rotation_degrees': 0,
      'position_format': 'latlon',
      'scale_bar_unit': 'nautical'
    }
  },

  props: [
    'debug_mode',
    'initial_crs',
    'initial_day_night_mode',
    'rotation_heading',
    'rotation_longitude'
  ],

  computed: {
    rotation_control_disabled: function() {
      if (this.rotation_source == 'manual') {
        return false;
      }
      return true;
    },
    rotation_radians: function() {
      return this.rotation_degrees * Math.PI / 180;
    }
  },

  watch: {
    debug_control: function () {
      this.$emit('update:debug_mode', this.debug_control);
    },
    rotation_heading: function () {
      if (this.rotation_source == 'heading') {
        this.rotation_degrees = this.rotation_heading;
      }
    },
    rotation_longitude: function () {
      if (this.rotation_source == 'longitude') {
        this.rotation_degrees = this.rotation_longitude;
      }
    },
    rotation_degrees: function () {
      this.$emit('update:rotation_radians', this.rotation_radians);
    }
  },

  methods: {
    onCRSChange: function ($event) {
      this.$emit("update:crs", this.crs);

      if (this.crs === 'EPSG:3857') {
        this.rotation_source = 'manual';
      }
    },
    onDayNightChange: function ($event) {
      this.$emit('update:day_night', this.day_night_mode);
    },
    onRotationSourceChange: function ($event) {
      this.rotation_source = $event.target.value;
      this.$emit('update:rotation_source', this.rotation_source);

      if (this.rotation_source === 'heading') {
        this.rotation_degrees = this.rotation_heading;
      } else if (this.rotation_source === 'longitude') {
        this.rotation_degrees = this.rotation_longitude;
      }
    },
    onPositionFormatChange: function ($event) {
      this.$emit('update:position_format', this.position_format);
    },
    onScaleBarUnitChange: function ($event) {
      this.$emit('update:scale_bar_unit', this.scale_bar_unit);
    }
  },

  mounted() {
    this.crs = this.initial_crs;
    this.day_night_mode = this.initial_day_night_mode;
  }
}
</script>

<style scoped>
  .app-map-controls {
    grid-area: map-controls2;
    border-left: 1px solid lime;
    border-bottom: 1px solid lime;
    z-index: 10;
    overflow-x: scroll;
  }

  .debug {
    border: 1px solid red;
    padding: 4px;
  }
</style>
