import { 
  CommitOptions, 
  createLogger, 
  createStore, 
  DispatchOptions, 
  Store as VuexStore 
} from "vuex";

import { ProjectManagerState, state } from "./state";
import { Mutations, mutations } from "./mutations";
import { Actions, actions } from "./actions";
import { Getters, getters } from "./getters";

export const store = createStore<ProjectManagerState>({
  plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : [],
  state,
  mutations,
  actions,
  getters
})

export function useStore()
{
 return store as Store
}

export type Store = Omit<
  VuexStore<ProjectManagerState>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P, 
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
}

// import { ApproachModel, isApproachModel } from '@/interfaces/approachModel'
// import { CostCenter, isCostCenter } from '@/interfaces/costCenter'
// import { Employee, EmployeeFunction, isEmployee } from '@/interfaces/employee'
// import { isProject, Project } from '@/interfaces/project'
// import { createStore } from 'vuex'

// // const Datastore = require('nedb')
// // const path = require('path')

// // Message generators
// const success = {
//   generic: (type: string, action: string): string => `${type} was successfully ${action}`,
// }

// const error = {
//   duplicate: (type: string, property: string): ReferenceError => new ReferenceError(`${type} with this '${property}' already exists`),
//   inexists: (type: string, property: string): ReferenceError => new ReferenceError(`No ${type} with this '${property}' exists`),
//   singleton: (type: string): ReferenceError => new ReferenceError(`A ${type} already exists`),
//   type: (type: string): TypeError => new TypeError(`data is not of type '${type}'`)
// }

// export default createStore({
//   state: {
//     /* 'employeeFunctions' are hardcoded and immutable. This could easily be moved to a database. */
//     employeeFunctions: [
//       { name: 'Developer',     note: 'Available for developer functions' },
//       { name: 'Designer',      note: 'Available for designer functions' },
//       { name: 'Project Lead',  note: 'Available as project lead' },
//       { name: 'Administrator', note: 'Available for administrative functions' }
//     ] as Array<EmployeeFunction>,

//     /* TODO: Will be taken from db */
//     approachModels: [
//       { title: 'HERMES', phases: ['Initialization', 'Concept', 'Realization', 'Introduction'] },
//       { title: 'IPDRCE', phases: ['Inform', 'Plan', 'Decide', 'Realize', 'Control', 'Evaluate'] }
//     ] as Array<ApproachModel>,
//     costCenters: [
//       { title: 'Education',              id: 'CC000' },
//       { title: 'Software Development',   id: 'CC200' },
//       { title: 'Software Testing',       id: 'CC210' },
//       { title: 'Software Documentation', id: 'CC220' },
//     ] as Array<CostCenter>,

//     projects: [] as Array<Project>,
//     newProject: null as Partial<Project> | null,
//     employees: [] as Array<Employee>
//   },

//   getters: {
//     allEmployeeFunctions: (state):  Array<EmployeeFunction> => state.employeeFunctions as Array<EmployeeFunction>,

//     allApproachModels: (state): Array<ApproachModel> => state.approachModels as Array<ApproachModel>,
//     getApproachModel: (state) => 
//       (title: ApproachModel['title']): ApproachModel => state.approachModels.filter(a => a.title == title)[0],

//     allCostCenters: (state): Array<CostCenter> => state.costCenters as Array<CostCenter>,
//     getCostCenter: (state) => 
//       (id: CostCenter['id']): CostCenter => state.costCenters.filter(c => c.id == id)[0],

//     allProjects: (state): Array<Project> => state.projects as Array<Project>,
//     getProject: (state) => 
//       (id: Project['id']): Project => state.projects.filter(p => p.id == id)[0],
//     getNewProject: (state) => state.newProject,

//     allEmployees: (state): Array<Employee> => state.employees as Array<Employee>,
//     getEmployee: (state) => 
//       (id: Employee['id']): Employee => state.employees.filter(e => e.id == id)[0],
//   },

//   mutations: {
//     addApproachModel: (state, payload: ApproachModel) => state.approachModels.push(payload),
//     removeApproachModel: (state, payload: ApproachModel) => state.approachModels = state.approachModels.filter(a => a.title != payload.title),

//     addCostCenter: (state, payload: CostCenter) => state.costCenters.push(payload),
//     removeCostCenter: (state, payload: CostCenter) => state.costCenters = state.costCenters.filter(c => c.id != payload.id),

//     addProject: (state, payload: Project) => state.projects.push(payload),
//     removeProject: (state, payload: Project) => state.projects = state.projects.filter(p => p.id != payload.id),
//     assignNewProject: (state, payload: Partial<Project>) => state.newProject = payload,

//     addEmployee: (state, payload: Employee) => state.employees.push(payload),
//     removeEmployee: (state, payload: Employee) => state.employees = state.employees.filter(e => e.id != payload.id)
//   },

//   actions: {
//     storeApproachModel: ({ commit, getters }, payload: ApproachModel): Promise<string> => 
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (getters.getApproachModel(payload.title))
//           reject(error.duplicate('approach model', 'title'))
//         else
//         {
//           if (!isApproachModel(payload)) 
//             reject(error.type('approach model'))
//           else
//           {
//             commit('addApproachModel', payload)
//             resolve(success.generic('approach model', 'stored'))
//           }
//         }
//       })
//     },
//     updateApproachModel: ({ commit, getters }, payload: ApproachModel): Promise<string> =>
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (!getters.getApproachModel(payload.title))
//           reject(error.inexists('approach model', 'title'))
//         else
//         {
//           if (!isApproachModel(payload)) 
//             reject(error.type('approach model'))
//           else
//           {          
//             commit('removeApproachModel', payload)
//             commit('addApproachModel', payload)
//             resolve(success.generic('approach model', 'updated'))
//           }
//         }
//       })
//     },
//     removeApproachModel: ({ commit, getters }, payload: ApproachModel): Promise<string> => 
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (!getters.getApproachModel(payload.title))
//           reject(error.inexists('approach model', 'title'))
//         else
//         {
//           if (!isApproachModel(payload)) 
//             reject(error.type('approach model'))
//           else
//           {
//             commit('removeApproachModel', payload)
//             resolve(success.generic('approach model', 'stored'))
//           }
//         }
//       })
//     },

//     storeCostCenter: ({ commit, getters }, payload: CostCenter): Promise<string> => 
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (getters.getCostCenter(payload.id))
//           reject(error.duplicate('cost center', 'id'))
//         else
//         {
//           if (!isCostCenter(payload)) 
//             reject(error.type('cost center'))
//           else
//           {
//             commit('addCostCenter', payload)
//             resolve(success.generic('cost center', 'stored'))
//           }
//         }
//       })
//     },
//     updateCostCenter: ({ commit, getters }, payload: CostCenter): Promise<string> =>
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (!getters.getCostCenter(payload.id))
//         {
//           reject(error.inexists('cost center', 'id'))
//         }
//         else
//         {
//           if (!isCostCenter(payload)) 
//             reject(error.type('cost center'))
//           else
//           {
//             commit('removeCostCenter', payload)
//             commit('addCostCenter', payload)
//             resolve(success.generic('cost center', 'updated'))
//           }
//         }
//       })
//     },
//     removeCostCenter: ({ commit, getters }, payload: CostCenter): Promise<string> => 
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (!getters.getCostCenter(payload.id))
//           reject(error.inexists('cost center', 'id'))
//         else
//         {
//           if (!isCostCenter(payload)) 
//             reject(error.type('cost center'))
//           else
//           {
//             commit('removeCostCenter', payload)
//             resolve(success.generic('cost center', 'stored'))
//           }
//         }
//       })
//     },

//     storeEmployee: ({ commit, getters }, payload: Employee): Promise<string> => 
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (getters.getEmployee(payload.id))
//           reject(error.duplicate('employee', 'id'))
//         else
//         {
//           if (!isEmployee(payload)) 
//             reject(error.type('employee'))
//           else
//           {
//             commit('addEmployee', payload)
//             resolve(success.generic('employee', 'stored'))
//           }
//         }
//       })
//     },
//     updateEmployee: ({ commit, getters }, payload: Employee): Promise<string> =>
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (!getters.getEmployee(payload.id))
//         {
//           reject(error.inexists('employee', 'id'))
//         }
//         else
//         {
//           if (!isEmployee(payload)) 
//             reject(error.type('employee'))
//           else
//           {
//             commit('removeEmployee', payload)
//             commit('addEmployee', payload)
//           }
//         }
//       })
//     },
//     removeEmployee: ({ commit, getters }, payload: Employee): Promise<string> => 
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (!getters.getEmployee(payload.id))
//           reject(error.inexists('employee', 'id'))
//         else
//         {
//           if (!isEmployee(payload)) 
//             reject(error.type('employee'))
//           else
//           {
//             commit('removeEmployee', payload)
//             resolve(success.generic('employee', 'stored'))
//           }
//         }
//       })
//     },

//     storeProject: ({ commit, getters }, payload: Project): Promise<string> => 
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (getters.getProject(payload.id))
//           reject(error.duplicate('project', 'id'))
//         else
//         {
//           if (!isProject(payload)) 
//             reject(error.type('project'))
//           else
//           {
//             commit('addProject', payload)
//             resolve(success.generic('project', 'stored'))
//           }
//         }
//       })
//     },
//     updateProject: ({ commit, getters }, payload: Project): Promise<string> =>
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (!getters.getProject(payload.id))
//         {
//           reject(error.inexists('project', 'id'))
//         }
//         else
//         {
//           if (!isProject(payload)) 
//             reject(error.type('project'))
//           else
//           {
//             commit('removeProject', payload)
//             commit('addProject', payload)
//             resolve(success.generic('project', 'updated'))
//           }
//         }
//       })
//     },
//     removeProject: ({ commit, getters }, payload: Project): Promise<string> => 
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (!getters.getProject(payload.id))
//           reject(error.inexists('project', 'id'))
//         else
//         {
//           if (!isProject(payload)) 
//             reject(error.type('project'))
//           else
//           {
//             commit('removeProject', payload)
//             resolve(success.generic('project', 'stored'))
//           }
//         }
//       })
//     },
//     setNewProject: ({ state, commit, getters }, payload: Partial<Project>): Promise<string> =>
//     {
//       return new Promise<string>((resolve, reject) =>
//       {
//         if (getters.getNewProject != null)
//           reject(error.singleton('new project'))
//         else
//         {
//           commit('assignNewProject', payload)
//           resolve(success.generic('new project', 'created'))
//         }
//       })
//     }
//   },

//   modules: {
//   }
// })