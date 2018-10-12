<template>
  <div>
    <label class="text-reader">
      Read File
      <input type="file" @change="loadTextFromFile" multiple>
    </label>
  <p>Files:</p>
  <ul id="fileRender">
    <li v-for="file in files" :key="file.index">
      Name: {{ file.name }}
      Size: {{ file.size }}
      Last Modified: {{ file.lastModifiedDate}}
    </li>
  </ul>
  <button class="button" @click="analyze">analyze</button>
    <div v-for="li in list" :key="li.index">
      Contract Name: {{li.content}}
    </div>
  <!-- <p>Contract Name: {{contractName}}</p> -->
  <h1 v-show="functionsLoaded">Functions:</h1>
  <div v-if="functionList > 0">test</div>
    <div v-for="funct in functionList" :key="funct.index">
      {{funct.content}}
    </div>
    <p></p>
  <p>{{text}}</p>
  <!-- <p>{{list}}</p> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      fileNames: null,
      files: null,
      text: 'null',
      contractName: null,
      contractArray: null,
      functionList: [],
      functionsLoaded: null,
      list: [],
      ok: null
    }
  },
  methods: {
    loadTextFromFile (ev) {
      var vm = this
      console.log(ev.target.files)
      console.log(this.files)
      this.files = ev.target.files
      console.log('this files:' + this.files)

      const file = ev.target.files[0]
      const textType = /text.*/
      if (file.type.match(textType)) {
        var reader = new FileReader()

        reader.onload = function (e) {
          // console.log(reader.result);
          vm.text = reader.result
          console.log('text result: ' + this.text)
          let n = reader.result.search('contract')
          console.log('contract name found at: ' + n)
          vm.contractName = reader.result.slice(n, n + 20)
          // console.log(reader.result.slice(n, n+20))
          console.log(vm.contractName)
        }
        reader.readAsText(file)
        // this.text = reader.result;
      } else {
        console.log('File not supported!')
      }
      // const reader = new FileReader()
      // reader.onload = e => this.$emit('load', e.target.result)
      // reader.readAsText(file)
      // // const textFile = reader.readAsText(file)
      // console.log('loaded text: ' + this.text)
    },
    analyze () {
      console.log('analyze this!')
      let vm = this
      // this.findContractName()
      // this.findFunctions()
      this.findElements(vm.text, 'function ', '{', vm.functionList)
      this.findElements(vm.text, 'contract ', '{', vm.list) // check this one
    },
    // findContractName () {
    //   let vm = this
    //   let preString = 'contract'
    //   let searchString = '{'
    //   let preIndex = vm.text.indexOf(preString)
    //   let postIndex = vm.text.indexOf(searchString)
    //   let searchIndex = preIndex + vm.text.substring(preIndex).indexOf(searchString)
    //   console.log(preIndex)
    //   console.log(postIndex)
    //   vm.contractName = vm.text.slice(preIndex + 9, searchIndex)
    //   console.log(vm.text.slice(preIndex + 9, searchIndex))
    // },
    // findFunctions () {
    //   let vm = this
    //   let preString = 'function '
    //   let searchString = '{'
    //   let preIndex = vm.text.indexOf(preString)
    //   let postIndex = vm.text.indexOf(searchString)
    //   let searchIndex = preIndex + vm.text.substring(preIndex).indexOf(searchString)
    //   console.log(preIndex)
    //   console.log(postIndex)
    //   console.log(searchIndex)
    //   let result = []
    //   vm.functionList = vm.text.slice(preIndex + 9, searchIndex)
    //   console.log('function? ' + vm.text.slice(preIndex + 9, searchIndex))
    //   console.log(result)
    // },
    findElements (source, find, endChar, listNew) {
      let vm = this
      let startString = []
      let result = []
      // let totalIndex
      for (let i = 0; i < source.length; ++i) {
        // If you want to search case insensitive use
        // if (source.substring(i, i + find.length).toLowerCase() == find) {
        if (source.substring(i, i + find.length) === find) {
          startString.push(i)
        }
      }
      if (source.length > 0) {
        this.functionsLoaded = true
      }
      console.log(startString)
      // console.log(vm.text.slice(startString[0] + 9, startString[0] + 20)) // just a test
      // Loop to find start and end of new string.
      for (let i = 0; i < startString.length; i++) {
        let searchIndex = startString[i] + vm.text.substring(startString[i]).indexOf(endChar)
        // console.log('Search Indexes ' + searchIndex)
        console.log(vm.text.slice(startString[i] + 9, searchIndex))
        // result.push(vm.text.slice(startString[i] + 9, searchIndex))
        // pushes found word to result array
        let funct = vm.text.slice(startString[i] + 9, searchIndex)
        result.push(funct)
      // console.log(vm.text.slice(startString[i] + 9, startString[i] + 40))
      }
      console.log('result: ' + result)
      // vm.result = vm.result.concat(result)
      // this.result.push(...result)
      // Loop over result array to push to data object.
      for (let i = 0; i < result.length; i++) {
        console.log('arrayLoop: index: ' + i + ' is: ' + result[i])
        listNew.push({id: i, content: result[i]})
        // this.list.push({id: i})
      }
      console.log(listNew)
      // return startString
    }
  }
}
</script>

<style>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;

  /* Fancy button looking */
  border: 2px solid black;
  border-radius: 5px;
  padding: 18px 40px;
  cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>
