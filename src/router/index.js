import Vue from 'vue'
import VueRouter from 'vue-router'
import Export from '../views/excel/MyExport.vue'
import Import from '../views/excel/MyImport.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Import',
    component: Import
  },
  {
    path: '/Export',
    name: 'Export',
    component: Export
  }
  
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
