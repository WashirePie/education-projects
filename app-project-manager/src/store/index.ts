import { ApproachModel } from '@/interfaces/approachModel'
import { CostCenter } from '@/interfaces/costCenter'
import { Employee, EmployeeFunction } from '@/interfaces/employee'
import { Project } from '@/interfaces/project'
import { createStore } from 'vuex'

// const Datastore = require('nedb')
// const path = require('path')


// Helper functions
const success = {
  generic: (type: string, action: string): string => `${type} was successfully ${action}`,
}

const error = {
  duplicate: (type: string, property: string): ReferenceError => new ReferenceError(`${type} with this '${property}' already exists`),
  inexists: (type: string, property: string): ReferenceError => new ReferenceError(`No ${type} with this '${property}' exists`)
}

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
      { title: 'Education',              id: 'CC000' },
      { title: 'Software Development',   id: 'CC200' },
      { title: 'Software Testing',       id: 'CC210' },
      { title: 'Software Documentation', id: 'CC220' },
    ] as Array<CostCenter>,

    projects: [] as Array<Project>,
    employees: [] as Array<Employee>
  },

  getters: {
    allEmployeeFunctions: (state):  Array<EmployeeFunction> => state.employeeFunctions as Array<EmployeeFunction>,

    allApproachModels: (state): Array<ApproachModel> => state.approachModels as Array<ApproachModel>,
    getApproachModel: (state) => (title: ApproachModel['title']): ApproachModel => state.approachModels.filter(a => a.title == title)[0],

    allCostCenters: (state): Array<CostCenter> => state.costCenters as Array<CostCenter>,
    getCostCenter: (state) => (id: CostCenter['id']): CostCenter => state.costCenters.filter(c => c.id == id)[0],

    allProjects: (state): Array<Project> => state.projects as Array<Project>,
    getProject: (state) => (id: Project['id']): Project => state.projects.filter(p => p.id == id)[0],

    allEmployees: (state): Array<Employee> => state.employees as Array<Employee>,
    getEmployee: (state) => (id: Employee['id']): Employee => state.employees.filter(e => e.id == id)[0],
  },

  mutations: {
    addApproachModel: (state, payload: ApproachModel) => state.approachModels.push(payload),
    removeApproachModel: (state, payload: ApproachModel) => state.approachModels = state.approachModels.filter(a => a.title != payload.title),

    addCostCenter: (state, payload: CostCenter) => state.costCenters.push(payload),
    removeCostCenter: (state, payload: CostCenter) => state.costCenters = state.costCenters.filter(c => c.id != payload.id),

    addProject: (state, payload: Project) => state.projects.push(payload),
    removeProject: (state, payload: Project) => state.projects = state.projects.filter(p => p.id != payload.id),

    addEmployee: (state, payload: Employee) => state.employees.push(payload),
    removeEmployee: (state, payload: Employee) => state.employees = state.employees.filter(e => e.id != payload.id)
  },

  actions: {
    storeApproachModel: ({ commit, getters }, payload: ApproachModel): Promise<string> => 
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (getters.getApproachModel(payload.title))
          reject(error.duplicate('approach model', 'title'))
        else
        {
          commit('addApproachModel', payload)
          resolve(success.generic('approach model', 'stored'))
        }
      })
    },
    updateApproachModel: ({ commit, getters }, payload: ApproachModel): Promise<string> =>
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (!getters.getApproachModel(payload.title))
          reject(error.inexists('approach model', 'title'))
        else
        {
          commit('removeApproachModel', payload)
          commit('addApproachModel', payload)
          resolve(success.generic('approach model', 'updated'))
        }
      })
    },
    removeApproachModel: ({ commit, getters }, payload: ApproachModel): Promise<string> => 
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (!getters.getApproachModel(payload.title))
          reject(error.inexists('approach model', 'title'))
        else
        {
          commit('removeApproachModel', payload)
          resolve(success.generic('approach model', 'stored'))
        }
      })
    },

    storeCostCenter: ({ commit, getters }, payload: CostCenter): Promise<string> => 
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (getters.getCostCenter(payload.id))
          reject(error.duplicate('cost center', 'id'))
        else
        {
          commit('addCostCenter', payload)
          resolve(success.generic('cost center', 'stored'))
        }
      })
    },
    updateCostCenter: ({ commit, getters }, payload: CostCenter): Promise<string> =>
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (!getters.getCostCenter(payload.id))
        {
          reject(error.inexists('cost center', 'id'))
        }
        else
        {
          commit('removeCostCenter', payload)
          commit('addCostCenter', payload)
          resolve(success.generic('cost center', 'updated'))
        }
      })
    },
    removeCostCenter: ({ commit, getters }, payload: CostCenter): Promise<string> => 
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (!getters.getCostCenter(payload.id))
          reject(error.inexists('cost center', 'id'))
        else
        {
          commit('removeCostCenter', payload)
          resolve(success.generic('cost center', 'stored'))
        }
      })
    },

    storeEmployee: ({ commit, getters }, payload: Employee): Promise<string> => 
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (getters.getEmployee(payload.id))
          reject(error.duplicate('employee', 'id'))
        else
        {
          commit('addEmployee', payload)
          resolve(success.generic('employee', 'stored'))
        }
      })
    },
    updateEmployee: ({ commit, getters }, payload: Employee): Promise<string> =>
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (!getters.getEmployee(payload.id))
        {
          reject(error.inexists('employee', 'id'))
        }
        else
        {
          commit('removeEmployee', payload)
          commit('addEmployee', payload)
          resolve(success.generic('employee', 'updated'))
        }
      })
    },
    removeEmployee: ({ commit, getters }, payload: Employee): Promise<string> => 
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (!getters.getEmployee(payload.id))
          reject(error.inexists('employee', 'id'))
        else
        {
          commit('removeEmployee', payload)
          resolve(success.generic('employee', 'stored'))
        }
      })
    },

    storeProject: ({ commit, getters }, payload: Project): Promise<string> => 
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (getters.getProject(payload.id))
          reject(error.duplicate('project', 'id'))
        else
        {
          commit('addProject', payload)
          resolve(success.generic('project', 'stored'))
        }
      })
    },
    updateProject: ({ commit, getters }, payload: Project): Promise<string> =>
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (!getters.getProject(payload.id))
        {
          reject(error.inexists('project', 'id'))
        }
        else
        {
          commit('removeProject', payload)
          commit('addProject', payload)
          resolve(success.generic('project', 'updated'))
        }
      })
    },
    removeProject: ({ commit, getters }, payload: Project): Promise<string> => 
    {
      return new Promise<string>((resolve, reject) =>
      {
        if (!getters.getProject(payload.id))
          reject(error.inexists('project', 'id'))
        else
        {
          commit('removeProject', payload)
          resolve(success.generic('project', 'stored'))
        }
      })
    },
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
