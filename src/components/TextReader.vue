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
  <p>Contract Name: {{contractName}}</p>
  <p>Functions: {{functions}}</p>
  <p>{{text}}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fileNames: null,
      files: null,
      text: 'null',
      contractName: 'ContractName: ',
      contractArray: null,
      functions: ''
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
          // for(let i = 0; i <= reader.result.length; i++){
          //   console.log(i)
          // }
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
      // console.log(vm.text)
      // let n = vm.text.search('{')
      // console.log(n)
      // const splitText = vm.text.split(" ");
      // console.log(splitText)
      // const dict = vm.text.split(" ");

      // const trimmed = vm.text.trim();
      // console.log('trimmed:'  + trimmed)
      // vm.contractArray = trimmed.split(" ");
      // console.log(vm.contractArray);

      // vm.contractArray = vm.text.split(" ");
      // console.log(vm.contractArray);
      // var a = vm.contractArray.indexOf("function");
      // var fruits = ["Banana", "Orange", "Apple", "Mango"];
      // var a = fruits.indexOf("Apple");
      // console.log('found contract: ' + a)
      this.findContractName()
      this.findFunctions()
      this.findElements(vm.text, 'function ', '{')
    },
    findContractName () {
      let vm = this
      let preString = 'contract'
      let searchString = '{'
      let preIndex = vm.text.indexOf(preString)
      let postIndex = vm.text.indexOf(searchString)
      let searchIndex = preIndex + vm.text.substring(preIndex).indexOf(searchString)
      console.log(preIndex)
      console.log(postIndex)
      vm.contractName = vm.text.slice(preIndex + 9, searchIndex)
      console.log(vm.text.slice(preIndex + 9, searchIndex))
    },
    findFunctions () {
      let vm = this
      let preString = 'function '
      let searchString = '{'
      let preIndex = vm.text.indexOf(preString)
      let postIndex = vm.text.indexOf(searchString)
      let searchIndex = preIndex + vm.text.substring(preIndex).indexOf(searchString)
      console.log(preIndex)
      console.log(postIndex)
      console.log(searchIndex)
      let result = []
      vm.functions = vm.text.slice(preIndex + 9, searchIndex)
      console.log('function? ' + vm.text.slice(preIndex + 9, searchIndex))
      console.log(result)
    },
    findElements (source, find, endChar) {
      let vm = this
      // let result = []
      // for(let i = 0; i <= vm.text.length; ++i){
      //   if(vm.text.substring(i, i+find.length) == find){}
      //   result.push(i)
      //   console.log(i)
      // }
      // console.log(result)
      let startString = []
      // let endString = []
      // let result = []
      let totalIndex;
      for (let i = 0; i < source.length; ++i) {
        // If you want to search case insensitive use
        // if (source.substring(i, i + find.length).toLowerCase() == find) {
        if (source.substring(i, i + find.length) === find) {
          startString.push(i)
        }
      }
      
      console.log(startString)
      // console.log(vm.text.slice(startString[0] + 9, startString[0] + 20)) // just a test
      for (let i = 0; i <= startString.length; i++) {
        console.log(vm.text.slice(startString[i] + 9, startString[i] + 40))
        // need to loop over startStrings here and find end of string as well. 
      }
      return startString
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
