import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import New from '@/views/New.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/new',
    name: 'New',
    component: New
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
