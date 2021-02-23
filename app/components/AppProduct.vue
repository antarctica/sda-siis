<template>
  <section>
    <input type="radio" name="product-selection" :id="'product-selection-' + id" :value="id" v-model="selected">
    <input type="checkbox" name="active-products" :id="'active-products-' + id" v-model="active">
    <p>{{ label }} ({{ status }})</p>
    <div v-if="has_granules && granules_selection_mode == 'single'">
      <button v-on:click="selectPreviousGranule" :disabled="can_select_previous_granule">&lt;&lt;</button>
      <button v-on:click="selectNextGranule" :disabled="can_select_next_granule">&gt;&gt;</button>
    </div>
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
      <p>Code: {{ code }}</p>
      <p>Selected: {{ is_selected }}</p>
      <p>Active: {{ is_active }}</p>
      <p>Has granules?: {{ has_granules }}</p>
      <div v-if="has_granules">
        <p>Granule selection mode: {{ granules_selection_mode }}</p>
        <p>Enable prev granule control {{ can_select_previous_granule }}</p>
        <p>Enable next granule control {{ can_select_next_granule }}</p>
        <p>Selected granule (index: {{ selected_granule_index }}):</p>
        <pre>{{ selected_granule }}</pre>
        <p>Granules:</p>
        <pre>{{ granules }}</pre>
      </div>
    </div>
    </section>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      'id': '',
      'code': '',
      'label': '',
      'status': '',
      'ogc_protocol': '',
      'ogc_protocol_url': '',
      'ogc_layer_name': '',
      'ogc_format': '',
      'ogc_style': '',
      'legend_url': '',
      'attribution': '',
      'opacity': 0,
      'is_active': false,
      'granules': [],
      'selected_granule_index': 0,
      'has_granules': false,
      'granules_selection_mode': ''
    }
  },

  props: [
    'api_endpoint',
    'ogc_endpoint',
    'time_filter',
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
    selected_granule: function () {
      return this.granules[this.selected_granule_index];
    },
    can_select_previous_granule: function() {
      if (this.selected_granule_index > 0) {
        return false;
      }
      return true;
    },
    can_select_next_granule: function() {
      if ((this.selected_granule_index + 1) < this.granules.length) {
        return false;
      }
      return true;
    }
  },

  watch: {
    time_filter: async function () {
      if (this.has_granules) {
        // as we don't know how many granules there will be the current selected index may be out of range,
        // we therefore set the index to 0 first and then update it the new array length after getting granules.
        this.selected_granule_index = 0
        this.granules = await this.getGranules();
        this.selected_granule_index = this.granules.length - 1;
      }
    },
    initial_active_product_ids: function () {
      this.checkIfActiveProduct();
    },
    selected_granule: function () {
      if (this.is_selected) {
        this.$emit("update:selected_granule", this.$data);
      }
    }
  },

  methods: {
    init: async function() {
      this.id = String(this.initial_product.id);
      this.code = this.initial_product.code;
      this.label = this.initial_product.label;
      this.status = this.initial_product.status;
      this.ogc_protocol = this.determinePreferredOGCProtocol(this.initial_product.types);
      this.ogc_protocol_url = this.determineOGCProtocolEndpoint();
      this.ogc_layer_name = this.initial_product.gs_layername,
      this.ogc_format = this.determineOGCFormat(this.initial_product.formats);
      this.ogc_style = this.initial_product.style;
      this.legend_url = this.determineLegendUrl();
      this.attribution = this.initial_product.attribution;
      this.opacity = 1;
      this.has_granules = !this.initial_product.static;

      if (this.has_granules) {
        this.granules_selection_mode = this.determineGranuleSelectionMode(this.initial_product.render_exclusive);
        this.granules = await this.getGranules();
        this.selected_granule_index = this.granules.length - 1;
      }
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
    determineGranuleSelectionMode: function(mode) {
      if (mode) {
        return 'single';
      }
      return 'multiple';
    },
    checkIfActiveProduct: function() {
      if (this.initial_active_product_ids.includes(this.id)) {
        this.is_active = true;
        this.$emit("update:active_product", this.$data);
      }
    },
    getGranules: async function() {
      let request_endpoint = this.api_endpoint + `/products/${this.code}/granules`;
      let request_config = {'params': {}};

      if (this.time_filter > 0) {
        request_config['params']['maxage'] = this.time_filter;
      }

      try {
        const response = await axios.get(request_endpoint, request_config);
        let granules = [];
        response.data.forEach((granule) => {
          granules.push({
            'id': granule.id,
            'label': granule.productname,
            'status': granule.status,
            'timestamp': granule.timestamp
          });
        });
        return granules;
      } catch (error) {
        console.error('Granules could not be retrieved');
        console.error(error);
      }
    },
    selectPreviousGranule: function() {
      this.selected_granule_index -= 1;
    },
    selectNextGranule: function() {
      this.selected_granule_index += 1;
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
