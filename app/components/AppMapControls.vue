<template>
  <section>
    <header><h4>Map Controls</h4></header>
    <label for="time-filter">CRS (Projection)</label>
    <select v-model="crs" @change="onCRSChange($event)">
      <option value="EPSG:3031">WGS84 Antarctic Polar Stereographic</option>
      <option value="EPSG:3413">WGS84 NSIDC Sea Ice Polar Stereographic North</option>
      <option value="EPSG:3857">WGS84 Pseudo-Mercator</option>
    </select>
    <div class="debug">
      <p>CRS: <output>{{ crs }}</output><p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      'crs': 'EPSG:3413'
    }
  },

  props: [
    'initial_crs'
  ],

  methods: {
    onCRSChange: function ($event) {
      this.$emit("update:crs", this.crs);
    }
  },

  mounted() {
    this.crs = this.initial_crs;
  }
}
</script>

<style scoped>
  .debug {
    border: 1px solid red;
    padding: 4px;
  }
</style>