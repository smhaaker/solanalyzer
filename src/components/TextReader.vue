<template>
  <div>
    <h2>Solidity Contract Analyzer</h2>
    <p>Please load one or more solidity contracts and analyze.</p>
    <p>Suggestions welcome</p>
    <label class="text-reader">
      Load Files
      <input type="file" @change="readMupltieFiles" multiple>
    </label>
    <label class="text-reader">
      Analyze
      <input type="button" @click="analyze">
    </label>
  <div id="filesList">
    <p v-if="filesLoaded">Files Loaded:</p>
  <ul id="fileRender"><h2 v-show="filesLoaded">Files Loaded:</h2>
    <li v-for="file in files" :key="file.index">
      <b>Name:</b> {{ file.name }}
      <b>Size:</b> {{ file.size }}
      <b>Last Modified:</b> {{ file.lastModifiedDate}}
    </li>
  </ul>
  </div>
  <div class='analyzed' v-for="li in contractContent" :key="li.index">
    <br>
    <div class='contracts'>
      <!-- <b>File ID: </b><br>{{li.id}} <br> -->
      <b id="listTitle">Contract Name: </b>
      <div id="list" v-for="cont in li.contractName" :key="cont.index">
        {{cont}}
      </div>
      <b id="listTitle" v-if="li.pragma.length > 0">Pragma Version: </b>
      <div id="list" v-for="prag in li.pragma" :key="prag.index">
        {{prag}}
      </div>
      <b id="listTitle" v-if="li.libraryName.length > 0">Libraries: </b>
      <div id="list" v-for="lib in li.libraryName" :key="lib.index">
        {{lib}}
      </div>
      <b id="listTitle" v-if="li.functions.length > 0">Contract Functions: </b>
      <div id="list" v-for="funct in li.functions" :key="funct.index">
        {{funct}}
      </div>
      <b id="listTitle" v-if="li.events.length > 0">Contract Events: </b>
      <div id="list" v-for="evt in li.events" :key="evt.index">
        {{evt}}
      </div>
    </div>
  </div><br>

  <!-- Add:
  - Whats missing in contract, such as name, pragma version and more.
  - Libraries
  - Inherits from
  - Interfaces
  - Multiple contracts pr file -->
  <!-- <p>text {{text}}</p> -->
  <!-- Below displays full text in text array -->
    <!-- <div v-for="tx in text" :key="tx.index">
      <b>ID</b>:  {{tx.id}}
      <b>CONTENT</b>:  {{tx.content}}
    </div> -->
  <!-- TestList displays sample data output-->
  <!-- <p>TestList: {{testList}}</p> -->

  </div>
</template>

<script>
export default {
  data () {
    return {
      files: null,
      text: [],
      contractName: null,
      functionList: [],
      filesLoaded: null,
      contractNameList: [],
      contractContent: [],
      testList: [{
        id: 1,
        contractName: 'hello there',
        functions: ['one', 'two', 'three']
      }]
    }
  },
  methods: {
    // loadTextFromFile (ev) {
    //   let vm = this
    //   vm.filesLoaded = true
    //   // let resultArray = []
    //   // File list Output
    //   // console.log(ev.target.files)
    //   // push({id: i, content: result[i]})
    //   // vm.files.push({id: i, content:ev.target.files})
    //   vm.files = ev.target.files
    //   for (let i = 0; i < ev.target.files.length; i++) {
    //     let reader = new FileReader()
    //     reader.onload = function (e) {
    //       vm.text = reader.result
    //       // resultArray.push(reader.result)
    //       // console.log('text output: ' + vm.text)
    //       // let n = reader.result.search('contract')
    //       // vm.contractName = reader.result.slice(n, n + 20)
    //       // console.log(vm.contractName)
    //       // console.log(resultArray)
    //     }
    //     console.log('count: ' + i)
    //     const file = ev.target.files[i] // sets to first uploaded file
    //     reader.readAsText(file)
    //   }
    // },
    readMupltieFiles (ev) {
      let vm = this
      vm.filesLoaded = true
      const files = ev.currentTarget.files
      vm.files = ev.target.files
      Object.keys(files).forEach(i => {
        vm.text.splice(i) // Clear old array
        const file = files[i]
        const reader = new FileReader()
        reader.onload = (ev) => {
          vm.text.push({id: i, content: reader.result})
        }
        reader.readAsBinaryString(file)
      })
    },
    analyze () {
      let vm = this
      // console.log(vm.text[0].content.replace(/\/\/.*?(?:\r\n|\r|\n)/g, '').replace(/\/\*[^*]+\*\//g, '').replace(/\/\*\*[^*]+\*\//g, ''))
      // regex replace commands, saving until tests are done.
      // console.log(vm.text[0].content.replace(/\/\/.*?(?:\r\n|\r|\n)/g, ''))
      // console.log(vm.text[0].content.replace(/\/\*[^*]+\*\//g, '')) // backslash asterisk

      // console.log(vm.text[0].content.replace(/\/\*/g, 'asterisk')) // backslash asterisk
      // console.log(vm.text[0].content.replace(/\*\//g, 'asterisk')) // asterisk forwardslash

      // console.log(vm.text[0].content.replace(/\/\//g, 'Comments'))
      vm.contractContent.splice(0) // Emptys contractContent object
      for (let i = 0; i < vm.files.length; i++) {
        let commentsStripped = vm.text[i].content.replace(/\/\/.*?(?:\r\n|\r|\n)/g, '').replace(/\/\*[^*]+\*\//g, '').replace(/\/\*\*[^*]+\*\//g, '')
        // if multiple contracts found in same file increase contract counter
        let foundContracts = this.findElements(commentsStripped, 'contract ', '{')
        let foundPragma = this.findElements(commentsStripped, 'pragma ', ';')
        let foundEvents = this.findElements(commentsStripped, 'event ', ';')
        let foundFunctions = this.findElements(commentsStripped, 'function ', '{')
        let foundLibraries = this.findElements(commentsStripped, 'library ', '{')
        vm.contractContent.push({id: i, pragma: foundPragma, contractName: foundContracts, libraryName: foundLibraries, functions: foundFunctions, events: foundEvents})
      }
    },
    findElements (source, find, endChar) {
      let startString = []
      let result = []
      // console.log('Type: ' + find)
      for (let i = 0; i < source.length; ++i) {
        // If you want to search case insensitive use
        // if (source.substring(i, i + find.length).toLowerCase() == find) {
        if (source.substring(i, i + find.length) === find) {
          startString.push(i)
        }
      }

      for (let i = 0; i < startString.length; i++) {
        let searchIndex = startString[i] + source.substring(startString[i]).indexOf(endChar)
        result.push(source.slice(startString[i] + find.length, searchIndex))
      }
      // console.log('Result Output: ' + result)
      return result
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
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
.text-reader:hover{
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}
.text-reader:active{
  background-color: goldenrod;
}
.analyzed{
  background-color: white;
  text-align: left;
  padding: 5px;
}
.contracts{
  border: 1px solid black;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  padding: 5px;
  border-radius: 5px;
}
#fileRender{
  text-align: left;
  list-style: none;
}
#list{
  padding: 2px;
}
#listTitle{
  background-color: aqua;
}
</style>
