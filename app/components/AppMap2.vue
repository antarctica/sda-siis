<template>
  <section>
    <header><h4>Map</h4></header>
    <p>CRS: <output>{{ crs }}</output><p>
  </section>
</template>

<script>
export default {
  data() {
    return {}
  },

  props: [
    'crs'
  ]
}
</script>
