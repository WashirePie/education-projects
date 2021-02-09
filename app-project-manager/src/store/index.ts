import { ApproachModel } from '@/interfaces/approachModel'
import { CostCenter } from '@/interfaces/costCenter'
import { Employee, EmployeeFunction } from '@/interfaces/employee'
import { Project } from '@/interfaces/project'
import { createStore } from 'vuex'

// const Datastore = require('nedb')
// const path = require('path')

export default createStore({
  state: {
    /* Hardcoded and immutable. This could be easily moved to a database. 
    All values are obviously not validate during runtime - hence they were chosen carefully */
    employeeFunctions: [
      { name: 'Developer',     note: 'Available for developer functions' },
      { name: 'Designer',      note: 'Available for designer functions' },
      { name: 'Project Lead',  note: 'Available as project lead' },
      { name: 'Administrator', note: 'Available for administrative functions' }
    ] as Array<EmployeeFunction>,

    /* TODO: Will be taken from db */
    approachModels: [
      { title: 'HERMES', phases: ['Initialization', 'Concept', 'Realization', 'Introduction'] },
      { title: 'IPDRCE', phases: ['Inform', 'Plan', 'Decide', 'Realize', 'Control', 'Evaluate'] }
    ] as Array<ApproachModel>,
    costCenters: [
      { title: 'Education',              identifier: 'CC000' },
      { title: 'Software Development',   identifier: 'CC200' },
      { title: 'Software Testing',       identifier: 'CC210' },
      { title: 'Software Documentation', identifier: 'CC220' },
    ] as Array<CostCenter>,

    projects: [] as Array<Project>,
    employees: [] as Array<Employee>
  },

  getters: {
    allApproachModels: (state) => state.approachModels as Array<ApproachModel>,
    allEmployeeFunctions: (state) => state.employeeFunctions as Array<EmployeeFunction>,
    allCostCenters: (state) => state.costCenters as Array<CostCenter>,
    allProjects: (state) => state.projects as Array<Project>,
    allEmployees: (state) => state.employees as Array<Employee>
  },

  mutations: {

  },

  actions: {
  },

  modules: {
  }
})

// TODO: Port to ts
// import { createStore } from 'vuex'
// import { ApproachModel, CostCenter, Employee, Project } from '../scripts/classes'

// const dummyPromise = () => new Promise((resolve, reject) => setTimeout(() => resolve(), 2500))

// export default createStore({
//   state: {
//     employeeFunctions: [
//       'Project Lead',
//       'Designer',
//       'Developer',
//       'Administrator'
//     ],

//     approachModels: [{
//       title: 'HERMES',
//       model: ['Initialization', 'Concept', 'Realization', 'Introduction']
//     }],

//     costCenters: [{
//       title: 'Education',
//       identifier: 'CC000'
//     }],

//     employees: [],
//     projects: []

//   },

//   mutations: {
//     push(state, payload)
//     {
//       if (payload instanceof ApproachModel)
//         state.approachModels.push(payload)
//       else if (payload instanceof CostCenter)
//         state.costCenters.push(payload)
//       else if (payload instanceof Employee)
//         state.employees.push(payload)
//       else if (payload instanceof Project)
//         state.projects.push(payload)
//       else
//         throw new Error("Dev-ERR: unknown type in 'push' mutation")

//       console.log(state)
//     },
//     remove(state, payload)
//     {
//       if (payload instanceof ApproachModel)
//         state.approachModels.filter(am => am != payload)
//       else if (payload instanceof CostCenter)
//         state.costCenters.filter(c => c != payload)
//       else if (payload instanceof Employee)
//         state.employees.filter(e => e != payload)
//       else if (payload instanceof Project)
//         state.projects.filter(p => p != payload)
//       else
//         throw new Error("Dev-ERR: unknown type in 'remove' mutation")
//     }
//   },

//   actions: {
//     // TODO: Add async DB functions here

//     storeApproachModel ({ state, commit }, payload)
//     {
//       return new Promise((resolve, reject) =>
//       {
//         try
//         {
//           payload = new ApproachModel(payload)
//           if (state.approachModels.filter(a => a.title == payload.title).length)
//             throw new Error('Approach Model already exists')
//           commit('push', payload)
//           dummyPromise().then(() => resolve('Approach Model stored'))
//           /* TODO: Redirect */
//         }
//         catch (error)
//         {
//           dummyPromise().then(() => reject(error))
//         }
//       })
//     },

//     storeCostCenter ({ state, commit }, payload)
//     {
//       return new Promise((resolve, reject) =>
//       {
//         try
//         {
//           payload = new CostCenter(payload)
//           if (state.costCenters.filter(a => a.identifier == payload.identifier).length)
//             throw new Error('Cost Center already exists')
//           commit('push', payload)
//           dummyPromise().then(() => resolve('Cost Center stored'))
//           /* TODO: Redirect */
//         }
//         catch (error)
//         {
//           dummyPromise().then(() => reject(error))
//         }

//         /* TODO: Redirect */
//       })
//     },

//     storeEmployee ({ state, commit }, payload)
//     {
//       return new Promise((resolve, reject) =>
//       {
//         try
//         {
//           payload = new Employee(payload)
//           if (state.employees.filter(a => a.personellIdentifier == payload.personellIdentifier).length)
//             throw new Error('Employee already exists')
//           commit('push', payload)
//           dummyPromise().then(() => resolve('Employee stored'))
//           /* TODO: Redirect */
//         }
//         catch (error)
//         {
//           dummyPromise().then(() => reject(error))
//         }
//       })
//     },

//     storeProject ({ state, commit }, payload)
//     {
//       return new Promise((resolve, reject) =>
//       {
//         try
//         {
//           payload = new Project(payload)
//           if (state.projects.filter(a => a.title == payload.title).length)
//             throw new Error('Project already exists')
//           commit('push', payload)
//           dummyPromise().then(() => resolve('Project stored'))
//           /* TODO: Redirect */
//         }
//         catch (error)
//         {
//           dummyPromise().then(() => reject(error))
//         }
//       })
//     }

//   },
//   getters: {
//   },
//   modules: {
//   }
// })
