import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import Planner from '@/views/Planner/Planner.vue'
import Create from '@/views/Create/Create.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/plan',
    name: 'Planner',
    component: Planner
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
