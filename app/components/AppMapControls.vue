<template>
  <section class="app-map-controls">
    <fieldset id="app-map-control-zoom"></fieldset>
    <fieldset id="app-map-control-fullscreen"></fieldset>
    <fieldset>
      <button v-on:click="display_ui = !display_ui" :class="!display_ui ? 'activated': null">O</button>
    </fieldset>
    <fieldset>
      <button v-on:click="updateMapCentre">C</button>
      <button v-on:click="follow_sensor_position = !follow_sensor_position" :class="follow_sensor_position ? 'activated': null">F</button>
    </fieldset>
    <fieldset>
      <button v-on:click="rotation_source = 'reset'" :class="rotation_source === 'reset' ? 'activated': null">Pr</button>
      <button v-on:click="rotation_source = 'heading'" :class="rotation_source === 'heading' ? 'activated': null">Hd</button>
      <button
        v-on:click="rotation_source = 'longitude'"
        :disabled="crs == 'EPSG:3857' ? 'disabled' : null"
        :class="rotation_source === 'longitude' ? 'activated': null"
      >
        Ln
      </button>
    </fieldset>
    <fieldset>
      <button v-on:click="crs = 'EPSG:3413'" :class="crs === 'EPSG:3413' ? 'activated': null">Ar</button>
      <button v-on:click="crs = 'EPSG:3031'" :class="crs === 'EPSG:3031' ? 'activated': null">An</button>
      <button v-on:click="crs = 'EPSG:3857'" :class="crs === 'EPSG:3857' ? 'activated': null">Mc</button>
    </fieldset>
    <fieldset>
      <button v-on:click="changePostionFormat" :class="position_format === 'xy' ? 'activated': null">DD</button>
      <button v-on:click="changeScaleBarUnit" :class="scale_bar_unit === 'metric' ? 'activated': null">NM</button>
    </fieldset>
    <fieldset>
      <button v-on:click="changeDayNightMode" :class="day_night_mode === 'night' ? 'activated': null">D</button>
    </fieldset>
    <fieldset>
      <button v-on:click="show_graticule = !show_graticule" :class="show_graticule ? 'activated': null">G</button>
    </fieldset>
    <fieldset>
      <button v-on:click="show_measure_tool = !show_measure_tool" :class="show_measure_tool ? 'activated': null">M</button>
      <div class="measure-tool-feature-tool-feature-count" :class="measure_tool_feature_count == 0 ? 'disabled' : null">{{ measure_tool_feature_count }}</div>
      <div class="measure-tool-feature-tool-feature-length" :class="measure_tool_feature_length == 0 ? 'disabled' : null">{{ measure_tool_feature_length }}m</div>
      <button v-on:click="resetDrawnFeature" :disabled="measure_tool_feature_count == 0 ? 'disabled' : null">R</button>
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
      'display_ui': true,
      'debug_control': false,
      'day_night_mode': 'day',
      'rotation_source': 'manual',
      'rotation_degrees': 0,
      'position_format': 'latlon',
      'scale_bar_unit': 'nautical',
      'follow_sensor_position': false,
      'map_centre_4326': [0,0],
      'show_graticule': true,
      'show_measure_tool': false,
    }
  },

  props: [
    'debug_mode',
    'initial_crs',
    'initial_day_night_mode',
    'rotation_heading',
    'rotation_longitude',
    'sensor_position',
    'measure_tool_feature_count',
    'measure_tool_feature_length',
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
    crs: function () {
      this.$emit("update:crs", this.crs);

      if (this.crs === 'EPSG:3857') {
        this.rotation_source = 'manual';
      }
    },
    rotation_source: function () {
      this.$emit('update:rotation_source', this.rotation_source);
      this.updateRotation();
    },
    display_ui: function () {
      this.$emit('update:display_ui', this.display_ui);
    },
    debug_control: function () {
      this.$emit('update:debug_mode', this.debug_control);
    },
    rotation_heading: function () {
      this.updateRotation();
    },
    rotation_longitude: function () {
      this.updateRotation();
    },
    rotation_degrees: function () {
      this.$emit('update:rotation_radians', this.rotation_radians);
    },
    sensor_position: function () {
      if (this.follow_sensor_position) {
        this.map_centre_4326 = this.sensor_position;
      }
    },
    map_centre_4326: function () {
      this.$emit('update:map_centre', this.map_centre_4326);
    },
    show_graticule: function () {
      this.$emit('update:show_graticule', this.show_graticule);
    },
    show_measure_tool: function () {
      this.$emit('update:show_measure_tool', this.show_measure_tool);
    },
  },

  methods: {
    changeDayNightMode: function ($event) {
      if (this.day_night_mode == 'day') {
        this.day_night_mode = 'night';
      } else if (this.day_night_mode == 'night') {
        this.day_night_mode = 'day';
      }
      this.$emit('update:day_night', this.day_night_mode);
    },
    changePostionFormat: function ($event) {
      if (this.position_format == 'latlon') {
        this.position_format = 'xy';
      } else if (this.position_format == 'xy') {
        this.position_format = 'latlon';
      }
      this.$emit('update:position_format', this.position_format);
    },
    changeScaleBarUnit: function ($event) {
      if (this.scale_bar_unit == 'nautical') {
        this.scale_bar_unit = 'metric';
      } else if (this.scale_bar_unit == 'metric') {
        this.scale_bar_unit = 'nautical';
      }
      this.$emit('update:scale_bar_unit', this.scale_bar_unit);
    },
    updateRotation: function() {
      // see https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/111#note_72883 for where this logic came from.
      if (this.rotation_source === 'heading') {
        if (this.crs === 'EPSG:3857') {
          this.rotation_degrees = this.invertSign(this.rotation_heading);
        } else if (this.crs === 'EPSG:3031') {
          this.rotation_degrees = this.invertSign(this.rotation_heading + this.rotation_longitude);
        } else if (this.crs === 'ESPG:3413') {
          this.rotation_degrees == this.invertSign(this.rotation_heading - this.rotation_longitude - 45);
        }
      } else if (this.rotation_source === 'longitude') {
        if (this.crs === 'EPSG:3857') {
          this.rotation_degrees = this.rotation_longitude;
        } else if (this.crs === 'EPSG:3031') {
          this.rotation_degrees = this.invertSign(this.rotation_longitude);
        } else if (this.crs === 'ESPG:3413') {
          this.rotation_degrees == this.rotation_longitude + 45;
        }
      } else if (this.rotation_source === 'reset') {
        this.rotation_degrees = 0
      }
    },
    invertSign: function (value) {
      if (Math.sign(value) === 1) {
        return -Math.abs(value);
      } else if (Math.sign(value) === -1) {
        return Math.abs(value);
      }
    },
    updateMapCentre: function() {
      this.map_centre_4326 = this.sensor_position;
    },
    resetDrawnFeature: function() {
      this.$emit('update:reset_drawn_feature');
    },
  },

  mounted() {
    this.crs = this.initial_crs;
    this.day_night_mode = this.initial_day_night_mode;
  }
}
</script>

<style scoped>
  .app-map-controls {
    grid-area: map-controls;
    z-index: 10;
  }

  fieldset {
    display: inline-flex;
    padding: 0 6px;
    border: none;
  }
  fieldset:first-of-type {
    padding-left: 0;
  }

  fieldset select, button,
  fieldset div button {
    height: 30px;
    width: 30px;
  }

  .activated {
    box-shadow: inset 1px 1px 4px #777;
    transform: translateY(1px);
    background-color: #d5caca;
    border-style: double;
    border-radius: 4px;
  }

  .measure-tool-feature-tool-feature-count,
  .measure-tool-feature-tool-feature-length {
    width: 28px;
    height: 25px;
    background-color: #e9e9ed;
    border: 1px solid #8f8f9d;
    border-radius: 4px;
    text-align: center;
    padding-top: 3px;
  }
  .measure-tool-feature-tool-feature-count.disabled,
  .measure-tool-feature-tool-feature-length.disabled {
    opacity: 60%;
  }
  .measure-tool-feature-tool-feature-length {
    width: 200px;
  }
</style>
