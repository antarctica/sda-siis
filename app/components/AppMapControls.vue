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
    <div class="debug">
      <p>Day/Night mode: <output>{{ day_night_mode }}</output></p>
      <p>CRS: <output>{{ crs }}</output><p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      'crs': 'EPSG:3413',
      'day_night_mode': 'system'
    }
  },

  props: [
    'initial_crs',
    'initial_day_night_mode'
  ],

  methods: {
    onCRSChange: function ($event) {
      this.$emit("update:crs", this.crs);
    },
    onDayNightChange: function (event) {
      this.$emit('update:day_night', this.day_night_mode);
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