<template>
  <section class="app-map-controls">
    <fieldset>
      <button v-on:click="display_ui = !display_ui">Show/Hide UI</button>
    </fieldset>
    <fieldset>
      <button v-on:click="debug_control = !debug_control">Debug Mode</button>
    </fieldset>
    <fieldset>
      <button v-on:click="changeDayNightMode">Day/Night Mode</button>
    </fieldset>
    <fieldset>
      <button v-on:click="crs = 'EPSG:3031'">Antarctic Projection</button>
      <button v-on:click="crs = 'EPSG:3413'">Arctic Projection</button>
      <button v-on:click="crs = 'EPSG:3857'">Mercator Projection</button>
    </fieldset>
    <fieldset>
      <button v-on:click="rotation_source = 'heading'">Heading Rotation</button>
      <button v-on:click="rotation_source = 'longitude'" :disabled="crs == 'EPSG:3857' ? 'disabled' : null">Longitude Rotation</button>
    <fieldset>
      <button v-on:click="updateMapCentre">Centre on sensor position</button>
      <button v-on:click="follow_sensor_position = !follow_sensor_position">Track sensor position</button>
    </fieldset>
    </fieldset>
    <fieldset>
      <button v-on:click="changePostionFormat">LonLat / XY</button>
    </fieldset>
    <fieldset>
      <button v-on:click="changeScaleBarUnit">nm / km</button>
    </fieldset>
    <fieldset>
      <button v-on:click="show_graticule = !show_graticule">Show Graticule</button>
    </fieldset>
    <fieldset>
      <button v-on:click="show_measure_tool = !show_measure_tool">Enable Measure Tool</button>
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
    border: 1px solid lime;
    border-top: none;
    z-index: 10;
  }

  fieldset {
    display: inline-block;
    border: none;
  }
  fieldset select, button {
    height: 30px;
  }

  .debug {
    border: 1px solid red;
    padding: 4px;
  }
</style>
