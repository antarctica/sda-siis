<template>
  <section>
    <input type="radio" name="product-selection" :id="'product-selection-' + id" :value="id" v-model="selected">
    <input type="checkbox" name="active-products" :id="'active-products-' + id" v-model="active">
    <p>{{ label }}</p>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      :id="'product-opacity-' + id"
      :name="'product-opacity-' + id"
      v-model.number="opacity"
    >
    <label :for="'product-opacity-' + id">Opacity</label>
    <div class="debug">
      <p>Selected: {{ is_selected }}</p>
      <p>Active: {{ is_active }}</p>
    </div>
    </section>
</template>

<script>
export default {
  data() {
    return {
      'id': '',
      'code': '',
      'label': '',
      'ogc_protocol': '',
      'ogc_protocol_url': '',
      'ogc_layer_name': '',
      'ogc_format': '',
      'ogc_style': '',
      'legend_url': '',
      'attribution': '',
      'opacity': 0,
      'is_active': false
    }
  },

  props: [
    'ogc_endpoint',
    'initial_product',
    'selected_product_id',
    "initial_active_product_ids"
  ],

  computed: {
    selected: {
      get: function() {
        return this.selected_product_id;
      },
      set: function() {
        this.$emit("update:selected_product", this.$data);
      }
    },
    active: {
      get: function() {
        return this.is_active;
      },
      set: function() {
        this.is_active = !this.is_active;
        this.$emit("update:active_product", this.$data);
      }
    },
    is_selected: function () {
      if (this.selected_product_id == this.id) {
        return true;
      }
      return false;
    },
  },

  watch: {
    initial_active_product_ids: function () {
      this.checkIfActiveProduct();
    }
  },

  methods: {
    init: function() {
      this.id = String(this.initial_product.id);
      this.code = this.initial_product.code;
      this.label = this.initial_product.label;
      this.ogc_protocol = this.determinePreferredOGCProtocol(this.initial_product.types);
      this.ogc_protocol_url = this.determineOGCProtocolEndpoint();
      this.ogc_layer_name = this.initial_product.gs_layername,
      this.ogc_format = this.determineOGCFormat(this.initial_product.formats);
      this.ogc_style = this.initial_product.style;
      this.legend_url = this.determineLegendUrl();
      this.attribution = this.initial_product.attribution;
      this.opacity = 1;
    },
    determinePreferredOGCProtocol: function(protocols) {
      if (protocols.includes('WMTS')) {
        return 'wmts';
      } else if (protocols.includes('WMS')) {
        return 'wms';
      } else if (protocols.includes('WFS')) {
        return 'wfs';
      }
    },
    determineOGCProtocolEndpoint: function() {
      if (this.ogc_protocol === 'wmts') {
        return `${this.ogc_endpoint}${this.initial_product.gs_tempwmtsendpoint}`;
      } else if (this.ogc_protocol === 'wms') {
        return `${this.ogc_endpoint}${this.initial_product.gs_tempwmsendpoint}`;
      } else if (this.ogc_protocol === 'wfs') {
        return `${this.ogc_endpoint}${this.initial_product.gs_tempwfsendpoint}`;
      }
    },
    determineOGCFormat: function(formats) {
      if (formats.includes('image/png')) {
        return 'image/png';
      } else if (formats.includes('image/jpeg')) {
        return 'image/jpeg';
      }
    },
    determineLegendUrl: function() {
      return `${this.ogc_endpoint}${this.initial_product.gs_tempwmsendpoint}/?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${this.ogc_layer_name}`;
    },
    checkIfActiveProduct: function() {
      if (this.initial_active_product_ids.includes(this.id)) {
        this.is_active = true;
        this.$emit("update:active_product", this.$data);
      }
    }
  },

  mounted() {
    this.init();
    this.checkIfActiveProduct();
  }
}
</script>

<style scoped>
  .debug {
    border: 2px solid red;
    padding: 4px;
  }
</style>
