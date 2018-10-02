import Vue from 'vue'
import Router from 'vue-router'
import TextReader from '@/components/TextReader'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TextReader',
      component: TextReader
    }
  ]
})
