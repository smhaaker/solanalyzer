<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <input type="file" id="files" name="files[]" multiple @change="loadFile"/>
    <output id="list"></output>
    <button class="button" @click="analyze">analyze</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Solidity File analyzer'
    }
  },
  methods: {
    analyze: function () {
      console.log('analyze this')
    },
    loadFile: function (ev) {
      const file = ev.target.files[0]
      const reader = new FileReader()

      reader.onload = e => this.$emit('load', e.target.result)
      reader.readAsText(file)
      console.log('files uploaded')
    }
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
