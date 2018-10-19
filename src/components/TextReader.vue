<template>
  <div>
    <h2>Solidity Contract Analyzer</h2>
    <p>Please load a smart contract and analyze, for now it only outputs functions and contract name.</p>

    <label class="text-reader">
      Load File
      <input type="file" @change="readMupltieFiles" multiple>
    </label>
    <label class="text-reader">
      Analyze
      <input type="button" @click="analyze">
    </label>
  <!-- <button class="text-reader" @click="analyze">Analyze</button> -->
  <div id="filesList">
  <ul id="fileRender"><h2 v-show="filesLoaded">Files Loaded:</h2>
    <li v-for="file in files" :key="file.index">
      <b>Name:</b> {{ file.name }}
      <b>Size:</b> {{ file.size }}
      <b>Last Modified:</b> {{ file.lastModifiedDate}}
    </li>
  </ul>
  </div>
  <!-- Should be sorted by type -->
  <div class="functions">
    <div v-for="li in contractNameList" :key="li.index">
      <h4 class="contractTitle">Contract Name: {{li.content}}</h4>
      <h4 class="title" v-show="functionsLoaded">Functions:</h4>
      <div class="functionsList" v-for="funct in functionList" :key="funct.index">
      {{funct.id}} {{funct.content}}
      </div>
    <p></p>
    </div>
  </div>
  <div v-for="functs in functionList" :key="functs.index">
    {{functs.content}}
  </div>
  <!-- <p>Contract Name: {{contractName}}</p> -->
    <!-- <div class="functionsList" v-for="funct in functionList" :key="funct.index">
      {{funct.content}}
    </div>
    <p></p> -->
    <p>{{functionList}}</p>
  <p>text {{text}}</p>
    <div v-for="tx in text" :key="tx.index">
      <b>ID</b>:  {{tx.id}}
      <b>CONTENT</b>:  {{tx.content}}
    </div>
    <p>{{files}}</p>
    <p>Testlist: {{testList}}</p>

  </div>
</template>

<script>
export default {
  data () {
    return {
      files: null,
      text: [],
      contractName: null,
      contractArray: null,
      functionList: [],
      functionsLoaded: null,
      filesLoaded: null,
      contractNameList: [],
      ok: null,
      testList: []
    }
  },
  methods: {
    loadTextFromFile (ev) {
      let vm = this
      vm.filesLoaded = true
      // let resultArray = []
      // File list Output
      // console.log(ev.target.files)
      // push({id: i, content: result[i]})
      // vm.files.push({id: i, content:ev.target.files})
      vm.files = ev.target.files
      for (let i = 0; i < ev.target.files.length; i++) {
        let reader = new FileReader()
        reader.onload = function (e) {
          vm.text = reader.result
          // resultArray.push(reader.result)
          // console.log('text output: ' + vm.text)
          // let n = reader.result.search('contract')
          // vm.contractName = reader.result.slice(n, n + 20)
          // console.log(vm.contractName)
          // console.log(resultArray)
        }
        console.log('count: ' + i)
        const file = ev.target.files[i] // sets to first uploaded file
        reader.readAsText(file)
      }
    },
    readMupltieFiles (ev) { // this seems to work. Now we need to fix the parser.
      let vm = this
      console.log('read many files')
      const files = ev.currentTarget.files;
      vm.files = ev.target.files
      Object.keys(files).forEach(i => {
        vm.text.splice(i) // Clear old array
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (ev) => {
          //server call for uploading or reading the files one-by-one
          //by using 'reader.result' or 'file'
          // vm.text = reader.result
          vm.text.push({id: i, content: reader.result})
        }
        reader.readAsBinaryString(file);
      })
    },
    analyze () {
      let vm = this
      console.log('amount of files: ' + vm.files.length)
      // We need to loop over multiple files here.
      // this.findElements(vm.text, 'function ', '{', vm.functionList)
      // this.findElements(vm.text, 'contract ', '{', vm.contractNameList)
      // // To write into object
      // this.findElements(vm.text, 'function ', '{', vm.testList.function)
      // this.findElements(vm.text, 'contract ', '{', vm.contractNameList)
      for (let i = 0; i < vm.files.length; i++) {
        // this.findTest(vm.text[i].content, 'function')
        this.findElements(vm.text[i].content, 'contract ', '{', vm.contractNameList)
        this.findElements(vm.text[i].content, 'function ', '{', vm.functionList)
      }

      // this.findTest(vm.text[0].content, 'contract')
      // this.findTest(vm.text[1].content, 'contract')
    },
    findTest (source, find) {
      let vm = this
      let startString = []
      let result = []
      console.log('Type: ' + find)
      console.log(source)
      for (let i = 0; i < source.length; ++i) {
        // If you want to search case insensitive use
        // if (source.substring(i, i + find.length).toLowerCase() == find) {
        if (source.substring(i, i + find.length) === find) {
          startString.push(i)
          console.log(i)
        }
      }
    },
    findElements (source, find, endChar, listNew) {
      let vm = this
      let startString = []
      let result = []
      console.log('Type: ' + find)
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
      // console.log(startString)
      // Loop to find start and end of new string.
      for (let i = 0; i < startString.length; i++) {
        let searchIndex = startString[i] + source.substring(startString[i]).indexOf(endChar)
        // console.log('Search Indexes ' + searchIndex)
        console.log('Found: ' + source.slice(startString[i] + 9, searchIndex))
        // Pushes found word to result array
        let funct = source.slice(startString[i] + 9, searchIndex)
        result.push(funct)
        // simplify
      }
      // Loop over result array to push to data object
      for (let i = 0; i < result.length; i++) {
        console.log('arrayLoop: index: ' + i + ' is: ' + result[i])
        listNew.splice(i) // Clear old array
        listNew.push({id: i, content: result[i]})
      }
      // console.log(listNew)
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
  /* border-radius: 5px; */
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
