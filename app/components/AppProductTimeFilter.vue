<template>
  <fieldset class="time-filters">
    <label for="time-filter">Time Filter</label>
    <button
      v-on:click="time_filter = -1"
      :disabled="time_filter == 'disabled' ? 'disabled' : null"
      :class="time_filter == -1 ? 'activated': null"
    >
      None
    </button>
    <button
      v-on:click="time_filter = 0"
      :disabled="time_filter == 'disabled' ? 'disabled' : null"
      :class="time_filter == 0 ? 'activated': null"
    >
      Default
    </button>
    <button
      v-on:click="time_filter = 72"
      :disabled="time_filter == 'disabled' ? 'disabled' : null"
      :class="time_filter == 72 ? 'activated': null"
    >
      72 H
    </button>
    <button
      v-on:click="time_filter = 48"
      :disabled="time_filter == 'disabled' ? 'disabled' : null"
      :class="time_filter == 48 ? 'activated': null"
    >
      48 H
    </button>
    <button
      v-on:click="time_filter = 24"
      :disabled="time_filter == 'disabled' ? 'disabled' : null"
      :class="time_filter == 24 ? 'activated': null"
    >
      24 H
    </button>
    <br />
    <label for="date-filter">Date filter</label>
    <input type="date" v-model="date_filter"/>
  </fieldset>
</template>

<script>
export default {
  data() {
    return {
      'time_filter': 0,
      'date_filter': '',
    }
  },

  watch: {
    date_filter: function () {
      if (this.date_filter !== "") {
        this.time_filter = 'disabled';
      } else {
        this.time_filter = 0;
      }

      this.$emit("update:date_filter", this.date_filter);
    },
    time_filter: function () {
      this.$emit("update:time_filter", this.time_filter);
    }
  }
}
</script>

<style scoped>
  fieldset {
    border: none;
  }

  .time-filters {
    font-size: 60%;
  }
  .time-filters button,
  .time-filters input {
    font-size: 80%;
  }
</style>