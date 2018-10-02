<template>
  <div id="app">
    <router-view/>
    <!-- <textarea rows="10" v-model="text" id='textfill'></textarea>
    <br>
    <text-reader @load="text = $event"></text-reader> -->
  </div>
</template>

<script>
import TextReader from './components/TextReader'

export default {
  name: 'App',
  data: () => ({ text: '' }),
  components: {
    TextReader
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#textfill {
  width: 80%;
  min-height: 400px;
}
</style>
