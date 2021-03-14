<template>
  <section>
    <header><h4>Map</h4></header>
    <p>CRS: <output>{{ crs }}</output></p>
    <p>Rotation (radians): <output>{{ rotation }}</output></p>
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
    'colour_scheme',
    'crs',
    'rotation',
    'product_granules'
  ],

  computed: {
    style_modifier: function () {
      if (this.colour_scheme == 'light') {
        return 'day';
      } else if (this.colour_scheme == 'dark') {
        return 'night';
      }
    }
  },

  watch: {
    colour_scheme: function () {
      this.initLayers();
    },
    product_granules: function () {
      this.initLayers();
    }
  },

  methods: {
    initLayers: function() {
      this.layers = [];

      this.product_granules.forEach((product_granule) => {
        let layer = {
          'protocol': product_granule.ogc_protocol,
          'endpoint': product_granule.ogc_protocol_url,
          'name': product_granule.ogc_layer_name,
          'format': product_granule.ogc_format,
          'style': `${product_granule.ogc_style}-${this.style_modifier}`,
          'attribution': product_granule.attribution
        }
        if (product_granule.has_granules) {
          layer['time'] = product_granule.granules[product_granule.selected_granule_index].timestamp;
        }
        this.layers.push(layer);
      });
    }
  },

  mounted() {
    this.initLayers();
  }
}
</script>
