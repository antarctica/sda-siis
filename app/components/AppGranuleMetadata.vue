<template>
  <section class="app-panel app-granule-metadata" :class="{hidden: hide_ui}">
    <div v-if="Object.keys(selected_product_granules).length">
      <p v-if="product">Product: <output>{{ product.label }}</output></p>
      <template v-if="granules">
        <div v-for="granule in granules" :key="granule.id">
          <p>Granule:</p>
          <ul class="granule-info">
            <li>Name: <output class="granule-label">{{ granule.label }}</output></li>
            <li>Time: <output>{{ granule.timestamp }}</output></li>
            <li>Status:
              <output class="status-control">
                <template v-if="granule.status == 'n/a'"><span class="status-indicator status-na"></span></template>
                <template v-else-if="granule.status == 'offline'"><span class="status-indicator status-offline"></span> Offline</template>
                <template v-else-if="granule.status == 'pending'"><span class="status-indicator status-pending"></span> Pending</template>
                <template v-else-if="granule.status == 'processing'"><span class="status-indicator status-processing"></span> Processing</template>
                <template v-else-if="granule.status == 'online'"><span class="status-indicator status-online"></span> Online</template>
                <template v-else-if="granule.status == 'outdated'"><span class="status-indicator status-outdated"></span> Outdated</template>
                <template v-else-if="granule.status == 'hr_requested'"><span class="status-indicator status-hr-requested"></span> HR Requested</template>
                <template v-else-if="granule.status == 'hr_pending'"><span class="status-indicator status-hr-pending"></span> HR Pending</template>
                <template v-else-if="granule.status == 'hr_processing'"><span class="status-indicator status-hr-processing"></span> HR Processing</template>
                <template v-else-if="granule.status == 'hr_online'"><span class="status-indicator status-hr-online"></span> HR Online</template>
              </output>
            </li>
          </ul>
          <template v-if="product.supports_high_res_granules">
            <button
              class="granule-hr-request"
              v-on:click="requestHRGranule(granule.id)"
              :disabled="granule.status == 'hr_requested' ||
                         granule.status == 'hr_pending' ||
                         granule.status == 'hr_processing' ||
                         granule.status == 'hr_online' ? 'disabled' : null"
            >Get High Resolution Granule
            </button>
          </template>
          <details>
              <summary>Full details</summary>
              <pre>{{ granule.raw }}</pre>
          </details>
        </div>
      </template>

      <p>Legend</p>
      <img :src="product.legend_url">

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
    </div>
    <div v-else>
      <p>Select a product to view granule metadata</p>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {}
  },

  props: [
    'api_endpoint',
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

  methods: {
    requestHRGranule: async function(granule_id) {
      let request_endpoint = this.api_endpoint + `/granules/${granule_id}/request_highres`;

      try {
        const response = await axios.post(request_endpoint);
        alert(response.statusText);
      } catch (error) {
        alert('Could not request high resolution granule');
        console.error(error);
      }
    },
  },
}
</script>

<style scoped>
  .app-granule-metadata {
    grid-area: granule-metadata;
    z-index: 10;
    font-size: 60%;
    height: fit-content;
    padding: 5px;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
  }

  .granule-info {
    padding-left: 20px;
  }
  .granule-label {
    overflow-wrap: anywhere;
  }
  .granule-hr-request {
    margin-bottom: 16px;
    font-size: 80%;
  }
</style>
