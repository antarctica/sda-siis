<template>
  <section class="app-panel app-product-switcher" :class="{hidden: hide_ui}">
    <app-product
      v-for="product in raw_products"
      :key="product.id"
      :api_endpoint="api_endpoint"
      :ogc_endpoint="ogc_endpoint"
      :initial_product="product"
      :initial_active_product_ids="initial_active_product_ids"
      :selected_product_id="selected_product_id"
      :selected_footprints="selected_footprints"
      v-on:update:selected_product="whenSelectedProductGranulesChange"
      v-on:update:selected_granules="whenSelectedProductGranulesChange"
      v-on:update:granule_parameters="whenProductGranuleParametersChange"
      v-on:update:active_product="whenActiveProductsChange"
    ></app-product>
    <div class="debug" v-if="debug_mode">
      <p>Selected product: {{ selected_product.id }} - {{ selected_product.code }}<p>
      <p>Active products:</p>
      <ul>
        <li v-for="product in active_products" :key="product.id">{{ product.id }} - {{ product.code }}</li>
      </ul>
    </div>
    <div class="debug" v-if="debug_mode">
      <p>Hemisphere: <output>{{ hemisphere }}</output></p>
      <p>Selected footprints:</p>
      <pre>{{ selected_footprints }}</pre>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

import AppProduct from './AppProduct.vue';

export default {
  data() {
    return {
      'arctic_default_product_ids': ['13', '4'],
      'antarctic_default_product_ids': ['12', '5'],
      'raw_products': [],
      'selected_product': {},
      'active_products': [],
      'additional_initial_active_product_ids': [],
    }
  },

  props: [
    'display_ui',
    'debug_mode',
    'api_endpoint',
    'ogc_endpoint',
    'crs',
    'selected_footprints'
  ],

  computed: {
    hide_ui: function() {
      return !this.display_ui;
    },
    selected_product_id: function() {
      return this.selected_product.id;
    },
    selected_product_granules: function () {
      let selected_granules = [];
      if (this.selected_product.has_granules) {
        this.selected_product.selected_granule_indexes.forEach((selected_granule_index) => {
          selected_granules.push(this.selected_product.granules[selected_granule_index]);
        });
      }
      return {
        'product': this.selected_product,
        'granules': selected_granules
      }
    },
    initial_active_product_ids: function() {
      if (this.crs == 'EPSG:3413') {
        return this.arctic_default_product_ids.concat(this.additional_initial_active_product_ids);
      } else if (this.crs == 'EPSG:3031') {
        return this.antarctic_default_product_ids.concat(this.additional_initial_active_product_ids);
      }
      return this.arctic_default_product_ids.concat(this.antarctic_default_product_ids).concat(this.additional_initial_active_product_ids);
    },
    hemisphere: function () {
      if (this.crs == 'EPSG:3413') {
        return 'n';
      } else if (this.crs == 'EPSG:3031') {
        return 's';
      }
      return false;
    },
  },

  watch: {
    crs: async function () {
      this.active_products = [];
      await this.getProducts();
    },
  },

  components: {
    AppProduct,
  },

  methods: {
    getProducts: async function () {
      let request_endpoint = this.api_endpoint + '/products';
      let request_config = {'params': {}};

      if (this.hemisphere) {
        request_config.params.hemi = this.hemisphere;
      }

      try {
        const response = await axios.get(request_endpoint, request_config);
        this.raw_products = response.data;
      } catch (error) {
        // alerts disabled as per https://gitlab.data.bas.ac.uk/MAGIC/SIIS/-/issues/199
        // alert('Products could not be retrieved');
        console.error(error);
      }
    },
    whenSelectedProductGranulesChange: function ($event) {
      this.selected_product = $event;
      this.$emit("update:selected_product_granules", this.selected_product_granules);
    },
    whenActiveProductsChange: function ($event) {
      if ($event.is_active && !this.active_products.includes($event.id)) {
        this.active_products.push($event);
      }

      if (!$event.is_active && this.active_products.some(product => product.id === $event.id)) {
        let _index = this.active_products.findIndex(product => product.id === $event.id);
        this.active_products.splice(_index, 1);
      }
      this.$emit("update:active_product_granules", this.active_products);
    },
    whenProductGranuleParametersChange: function ($event) {
      // piggyback on the selected_product_granules event
      this.$emit("update:selected_product_granules", this.selected_product_granules);
    }
  },

  async mounted() {
    await this.getProducts();
  }
}
</script>

<style scoped>
  .app-product-switcher {
    grid-area: products-switcher;
    z-index: 10;
    display: grid;
    row-gap: 10px;
    padding: 5px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .debug {
    border: 1px solid red;
    padding: 4px;
  }
</style>
