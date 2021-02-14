<template>
  <section>
    <header><h4>Granule Metadata</h4></header>
    <div v-if="Object.keys(selected_product_granule).length">
      <p v-if="product">Product: <output>{{ product.id }}</output></p>
      <p v-if="granule">Granule: <output>{{ granule.id }}</output></p>
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
