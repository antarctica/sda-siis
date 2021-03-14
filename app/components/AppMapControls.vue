<template>
  <section>
    <header><h4>Map Controls</h4></header>
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
    <div class="debug">
      <p>Day/Night mode: <output>{{ day_night_mode }}</output></p>
      <p>CRS: <output>{{ crs }}</output><p>
      <p>Rotation source: <output>{{ rotation_source }}</output></p>
      <p>Rotation value (degrees): <output>{{ rotation_degrees }}</output></p>
      <p>Rotation value (radians): <output>{{ rotation_radians }}</output></p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      'crs': 'EPSG:3413',
      'day_night_mode': 'system',
      'rotation_source': 'manual',
      'rotation_degrees': 0
    }
  },

  props: [
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
    rotation_heading: function () {
      if (this.rotation_source == 'heading') {
        this.rotation_degrees = this.rotation_heading;
      }
    },
    rotation_longitude: function () {
      if (this.rotation_source == 'heading') {
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
    onDayNightChange: function (event) {
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
    }
  },

  mounted() {
    this.crs = this.initial_crs;
    this.day_night_mode = this.initial_day_night_mode;
  }
}
</script>

<style scoped>
  .debug {
    border: 1px solid red;
    padding: 4px;
  }
</style>