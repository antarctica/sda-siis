<template>
  <section class="app-granule-metadata" :class="{hidden: hide_ui}">
    <header><h4>Granule Metadata</h4></header>
    <div v-if="Object.keys(selected_product_granules).length">
      <p v-if="product">Product: <output>{{ product.label }}</output></p>
      <template v-if="granules">
        <div v-for="granule in granules" :key="granule.id">
          <p>Granule:</p>
          <ul>
            <li>Name: <output>{{ granule.label }}</output></li>
            <li>Time: <output>{{ granule.timestamp }}</output></li>
            <li>Status:
              <output class="status-control">
                <template v-if="granule.status == 'n/a'"><span class="status-indicator status-na"></span></template>
                <template v-else-if="granule.status == 'offline'"><span class="status-indicator status-offline"></span> Offline</template>
                <template v-else-if="granule.status == 'pending'"><span class="status-indicator status-pending"></span> Pending</template>
                <template v-else-if="granule.status == 'processing'"><span class="status-indicator status-processing"></span> Processing</template>
                <template v-else-if="granule.status == 'online'"><span class="status-indicator status-online"></span> Online</template>
                <template v-else-if="granule.status == 'outdated'"><span class="status-indicator status-outdated"></span> Outdated</template>
              </output>
            </li>
          </ul>
          <details>
              <summary>Full details</summary>
              <pre>{{ granule.raw }}</pre>
          </details>
        </div>
      </template>
      <img :src="product.legend_url">
    </div>
    <div v-else>
      <p>Select a product to view granule metadata</p>
    </div>
    <template v-if="product && product.supports_value_at_pixel">
      <header><h4>Value at pixel (Selected product/granule)</h4></header>
      <template v-if="product.code == 'siis.ic-nor.s'">
        Ice Class: <output>{{ value_at_pixel_feature.nis_class }}</output>
      </template>
      <template v-else-if="product.code == 'siis.sic.s'">
        Value: <output>{{ value_at_pixel_feature.PALETTE_INDEX }}</output>
      </template>
      <template v-else>
        <pre>{{ value_at_pixel_feature }}</pre>
      </template>
    </template>
  </section>
</template>

<script>
export default {
  data() {
    return {}
  },

  props: [
    'display_ui',
    'selected_product_granules',
    'value_at_pixel_feature'
  ],

  computed: {
    hide_ui: function() {
      return !this.display_ui;
    },
    product: function () {
      return this.selected_product_granules.product;
    },
    granules: function () {
      return this.selected_product_granules.granules;
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
