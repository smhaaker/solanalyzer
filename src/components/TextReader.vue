<template>
  <div>
    <h2>Solidity Contract Analyzer</h2>
    <p>Please load one or more solidity contracts and analyze.</p>
    <p>Feel free to make additions as it is in very early development right now.</p>
    <label class="text-reader">
      Load Files
      <input type="file" @change="readMupltieFiles" multiple>
    </label>
    <label class="text-reader">
      Analyze
      <input type="button" @click="analyze">
    </label>
  <div id="filesList">
    <p>Files Loaded:</p>
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
      <b>File ID: </b><br>{{li.id}} <br>
      <b>Contract Name: </b>
      <div v-for="cont in li.contractName" :key="cont.index">
        {{cont}}
      </div>
      <b>Pragma Version: </b>
      <div v-for="prag in li.pragma" :key="prag.index">
        {{prag}}
      </div>
      <b>Contract Functions: </b>
      <div v-for="funct in li.functions" :key="funct.index">
        {{funct}}
      </div>
      <b>Contract Events: </b>
      <div v-for="evt in li.events" :key="evt.index">
        {{evt}}
      </div>
    </div>
  </div><br>

  <p>text {{text}}</p>
  <!-- Below displays full text in text array -->
    <div v-for="tx in text" :key="tx.index">
      <b>ID</b>:  {{tx.id}}
      <b>CONTENT</b>:  {{tx.content}}
    </div>
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
      console.log('Read Multiple Files')
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
      // console.log(vm.text[0].content.replace(/\/\/.*?(?:\r\n|\r|\n)/g, '').replace(/\/\*[^*]+\*\//g, ''))
      // regex replace commands, saving until tests are done.
      // console.log(vm.text[0].content.replace(/\/\/.*?(?:\r\n|\r|\n)/g, ''))
      // console.log(vm.text[0].content.replace(/\/\*[^*]+\*\//g, '')) // backslash asterisk

      // console.log(vm.text[0].content.replace(/\/\*/g, 'asterisk')) // backslash asterisk
      // console.log(vm.text[0].content.replace(/\*\//g, 'asterisk')) // asterisk forwardslash

      // console.log(vm.text[0].content.replace(/\/\//g, 'Comments'))
      vm.contractContent.splice(0) // Emptys contractContent object
      for (let i = 0; i < vm.files.length; i++) {
        let commentsStripped = vm.text[i].content.replace(/\/\/.*?(?:\r\n|\r|\n)/g, '').replace(/\/\*[^*]+\*\//g, '')
        // if multiple contracts found in same file increase contract counter
        let foundContracts = this.findElements(commentsStripped, 'contract ', '{')
        let foundPragma = this.findElements(commentsStripped, 'pragma ', ';')
        let foundEvents = this.findElements(commentsStripped, 'event ', ';')
        let foundFunctions = this.findElements(commentsStripped, 'function ', '{')
        // find version pragma // pragma solidity ^0.4.0;
        vm.contractContent.push({id: i, pragma: foundPragma,contractName: foundContracts, functions: foundFunctions, events: foundEvents})
  
      }
    },
    findElements (source, find, endChar) {
      let startString = []
      let result = []
      let ignore = []
      let ignoreBlock = []
      let lineBreaks = []
      // console.log('Type: ' + find)
      for (let i = 0; i < source.length; ++i) {
        if (source.substring(i, i + 2) === '//') {
          // console.log('found comment at: ' + i)
          ignore.push(i)
        }
        if (source.substring(i, i + 2) === '/*' || source.substring(i, i + 2) === '*/') {
          // console.log('found comment at: ' + i)
          ignoreBlock.push(i)
        }
        if (source.substring(i, i + 1) === '\n') { // add '\n' and \n\n , /\r\n|\r|\n/g
          // console.log('FOUND LINEBREAKS: ' + i)
          lineBreaks.push(i)
        }
        // If you want to search case insensitive use
        // if (source.substring(i, i + find.length).toLowerCase() == find) {
        if (source.substring(i, i + find.length) === find) {
          startString.push(i)
        }
      }
      // console.log('ignores found: ' + ignore + ' in ' + find)
      // console.log('ignoreBlock found: ' + ignoreBlock + ' in ' + find)
      // console.log('linebreaks found: ' + lineBreaks + ' in ' + find)
      // console.log('startStrings: ' + startString + ' in ' + find)

      for (let j = 0; j < ignore.length; j++) {
        console.log('All the ignores ' + ignore[j])
        let found = lineBreaks.find(function (element) {
          return element > ignore[j]
        })
        console.log(found)
      }

      for (let i = 0; i < startString.length; i++) {
        let searchIndex = startString[i] + source.substring(startString[i]).indexOf(endChar)
        result.push(source.slice(startString[i] + find.length, searchIndex))
      }
      // console.log('Result Output: ' + result)

      // let found = lineBreaks.find(function (element) {
      //   return element > ignore[1] // first linebreak after an ignore
      // })

      // console.log(found)

      return result
    },
    findToIgnore (value) {
      return function (element, index, array) {
        return (element >= value)
        // return (element <= value && element >= secondValue)
      }
    },
    // filter between start and stop of block.
    findToIgnoreBlock (value) {
      return function (element, index, array) {
        // element must be between arrayvalue even and odd
        return (element % 2 === 0)
      }
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
</style>
