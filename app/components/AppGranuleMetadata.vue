<template>
  <section class="app-granule-metadata">
    <header><h4>Granule Metadata</h4></header>
    <div v-if="Object.keys(selected_product_granule).length">
      <p v-if="product">Product: <output>{{ product.label }}</output></p>
      <div v-if="granule">
        <p>Granule:</p>
        <ul>
          <li>Name: <output>{{ granule.label }}</output></li>
          <li>Time: <output>{{ granule.timestamp }}</output></li>
        </ul>
      </div>
      <img :src="product.legend_url">
    </div>
    <div v-else>
      <p>Select a product to view granule metadata</p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {}
  },

  props: [
    'selected_product_granule'
  ],

  computed: {
    product: function () {
      return this.selected_product_granule.product;
    },
    granule: function () {
      return this.selected_product_granule.granule;
    },
  },
}
</script>

<style scoped>
  .app-granule-metadata {
    grid-area: granule-metadata;
    border-left: 1px solid orange;
    border-bottom: 1px solid orange;
    z-index: 10;
  }
</style>
