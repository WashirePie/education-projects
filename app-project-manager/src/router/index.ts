import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import Planner from '@/views/Planner/Planner.vue'
import Manager from '@/views/Manager/Manager.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/plan',
    name: 'Planner',
    component: Planner
  },
  {
    path: '/execute',
    name: 'Manager',
    component: Manager
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
