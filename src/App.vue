<template>
  <div id="app">
    <G6Topology />
    <G6Tutorial />
  </div>
</template>

<script>
import G6Topology from './components/G6Topology.vue'
import G6Tutorial from './components/G6Tutorial.vue'

export default {
  name: 'App',
  components: {
    G6Topology,
    G6Tutorial,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
