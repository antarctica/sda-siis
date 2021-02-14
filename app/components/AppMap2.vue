<template>
  <section>
    <header><h4>Map</h4></header>
    <p>CRS: <output>{{ crs }}</output><p>
    <pre v-for="layer in layers" :key="layer.name">{{ JSON.stringify(layer) }}</pre>
  </section>
</template>

<script>
export default {
  data() {
    return {
      'layers': []
    }
  },

  props: [
    'crs',
    'product_granules'
  ],

  watch: {
    product_granules: function () {
      this.initLayers();
    }
  },

  methods: {
    initLayers: function() {
      this.layers = [];

      this.product_granules.forEach((product_granule) => {
        this.layers.push({
          'protocol': product_granule.ogc_protocol,
          'endpoint': product_granule.ogc_protocol_url,
          'name': product_granule.ogc_layer_name,
          'format': product_granule.ogc_format,
          'style': product_granule.ogc_style,
          'attribution': product_granule.attribution
        })
      });
    }
  },

  mounted() {
    this.initLayers();
  }
}
</script>
