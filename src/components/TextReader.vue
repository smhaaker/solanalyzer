<template>
  <div>
    <h2>Solidity Contract Analyzer</h2>
    <p>Please load a smart contract and analyze, for now it only outputs functions and contract name.</p>

    <label class="text-reader">
      Read File
      <input type="file" @change="loadTextFromFile" multiple>
    </label>

  <button class="text-reader" @click="analyze">analyze</button>

  <div id="filesList">
  <ul id="fileRender"><h2 v-show="filesLoaded">Files Loaded:</h2>
    <li v-for="file in files" :key="file.index">
      Name: {{ file.name }}
      Size: {{ file.size }}
      Last Modified: {{ file.lastModifiedDate}}
    </li>
  </ul>
  </div>
  <div class="functions">
    <div v-for="li in list" :key="li.index">
      <h4 class="contractTitle">Contract Name: {{li.content}}</h4>
      <h4 class="title" v-show="functionsLoaded">Functions:</h4>
      <div class="functionsList" v-for="funct in functionList" :key="funct.index">
      {{funct.id}} {{funct.content}}
      </div>
    <p></p>
    </div>
  </div>
  <!-- <p>Contract Name: {{contractName}}</p> -->
  <!-- <div v-if="functionList > 0">test</div> -->
    <!-- <div class="functionsList" v-for="funct in functionList" :key="funct.index">
      {{funct.content}}
    </div>
    <p></p> -->
  <!-- <p>{{text}}</p> -->
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
      filesLoaded: null,
      list: [],
      ok: null
    }
  },
  methods: {
    loadTextFromFile (ev) {
      var vm = this
      vm.filesLoaded = true;
      console.log(ev.target.files)
      console.log(this.files)
      this.files = ev.target.files
      console.log('this files:' + this.files)

      const file = ev.target.files[0]
      // const textType = /text.*/
      // if (file.type.match(textType)) {
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
      // } else {
      // console.log('File not supported!')
      // }
      // const reader = new FileReader()
      // reader.onload = e => this.$emit('load', e.target.result)
      // reader.readAsText(file)
      // // const textFile = reader.readAsText(file)
      // console.log('loaded text: ' + this.text)
    },
    analyze () {
      console.log('analyze this!')
      let vm = this
      this.findElements(vm.text, 'function ', '{', vm.functionList)
      this.findElements(vm.text, 'contract ', '{', vm.list) // check this one
    },
    findElements (source, find, endChar, listNew) {
      let vm = this
      let startString = []
      let result = []
      for (let i = 0; i < source.length; ++i) {
        // If you want to search case insensitive use
        // if (source.substring(i, i + find.length).toLowerCase() == find) {
        if (source.substring(i, i + find.length) === find) {
          startString.push(i)
        }
      }
      // display text on webpage if functions are loaded. Clear this to any.
      if (source.length > 0) {
        this.functionsLoaded = true
      }
      console.log(startString)
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
      // this.result.push(...result)
      // Loop over result array to push to data object
      for (let i = 0; i < result.length; i++) {
        console.log('arrayLoop: index: ' + i + ' is: ' + result[i])
        listNew.splice(i) // empty old array
        listNew.push({id: i, content: result[i]})
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
.functions{
  align-content: left;
  background-color: darkgray;
  border-top-left-radius: 15px;
}
.functionsList{
  background-color: gray;
  text-align: left;
  padding: 5px;
  border-radius: 5px;
  margin-top: 5px;
  width: 30%;
}
.title{
  text-align: left;
  padding: 5px;
  background-color: darkgreen;
  width: 30%;
}
.contractTitle{
  text-align: left;
  padding: 5px;
  background-color: aqua;
  border-top-left-radius: 15px;
}
#fileRender{
  list-style: none;
}
#filesList{
  text-align: left;
}
</style>
