import { createStore } from 'vuex'

export default createStore({
  state: {
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
