import { ApproachModel } from "@/interfaces/approachModel";
import { CostCenter } from "@/interfaces/costCenter";
import { Employee } from "@/interfaces/employee";
import { Project } from "@/interfaces/project";
import { ActionContext, ActionTree } from "vuex";
import { Mutations, MutationType } from "./mutations";
import { ProjectManagerState, state } from "./state";

export enum ActionTypes 
{
  storeEmployee = "STORE_EMPLOYEE",
  updateEmployee = "UPDATE_EMPLOYEE",
  deleteEmployee = "DELETE_EMPLOYEE",
  storeApproachModel  = "STORE_APPROACHMODEL",
  updateApproachModel = "UPDATE_APPROACHMODEL",
  deleteApproachModel = "DELETE_APPROACHMODEL",
  storeCostCenter = "STORE_COSTCENTER",
  updateCostCenter = "UPDATE_COSTCENTER",
  deleteCostCenter = "DELETE_COSTCENTER",
  storeProject = "STORE_PROJECT",
  updateProject = "UPDATE_PROJECT",
  deleteProject = "DELETE_PROJECT",
  setNewProject = "SET_NEW_PROJECT",
}

type ActionAugments = Omit<ActionContext<ProjectManagerState, ProjectManagerState>, 'commit'> &
{
  commit<K extends keyof Mutations>( key: K, payload: Parameters<Mutations[K]>[1]):
  ReturnType<Mutations[K]>
}

export type Actions = {
  [ActionTypes.storeEmployee](context: ActionAugments, employee: Employee): Promise<string>
  [ActionTypes.updateEmployee](context: ActionAugments, employee: Employee): Promise<string>
  [ActionTypes.deleteEmployee](context: ActionAugments, employee: Employee): Promise<string>

  [ActionTypes.storeApproachModel](context: ActionAugments, model: ApproachModel): Promise<string>
  [ActionTypes.updateApproachModel](context: ActionAugments, model: ApproachModel): Promise<string>
  [ActionTypes.deleteApproachModel](context: ActionAugments, model: ApproachModel): Promise<string>

  [ActionTypes.storeCostCenter](context: ActionAugments, costCenter: CostCenter): Promise<string>
  [ActionTypes.updateCostCenter](context: ActionAugments, costCenter: CostCenter): Promise<string>
  [ActionTypes.deleteCostCenter](context: ActionAugments, costCenter: CostCenter): Promise<string>

  [ActionTypes.storeProject](context: ActionAugments, project: Project): Promise<string>
  [ActionTypes.updateProject](context: ActionAugments, project: Project): Promise<string>
  [ActionTypes.deleteProject](context: ActionAugments, project: Project): Promise<string>
  [ActionTypes.setNewProject](context: ActionAugments, nullableProject: Project | null): Promise<string>
}

// Message generators
const success = {
  generic: (type: string, action: string): string => `${type} was successfully ${action}`,
}

const error = {
  duplicate: (type: string, property: string): ReferenceError => new ReferenceError(`${type} with this '${property}' already exists`),
  inexists: (type: string, property: string): ReferenceError => new ReferenceError(`No ${type} with this '${property}' exists`),
  singleton: (type: string): ReferenceError => new ReferenceError(`A ${type} already exists`),
  type: (type: string): TypeError => new TypeError(`data is not of type '${type}'`)
}

// Helper functions to consistently query the relevant property
const getEmployee = (state: ProjectManagerState, id: Employee['id']): Employee | undefined => 
  state.employees.filter(e => e.id === id)[0]

const getApproachModel = (state: ProjectManagerState, title: ApproachModel['title']): ApproachModel | undefined => 
  state.approachModels.filter(a => a.title === title)[0]

const getCostCenter = (state: ProjectManagerState, id: CostCenter['id']): CostCenter | undefined => 
  state.costCenters.filter(c => c.id === id)[0]

const getProject = (state: ProjectManagerState, id: Project['id']): Project | undefined => 
  state.projects.filter(p => p.id === id)[0]

export const actions: ActionTree<ProjectManagerState, ProjectManagerState> & Actions = {
  [ActionTypes.storeEmployee]({ commit }, employee) 
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (getEmployee(state, employee.id)) reject(error.duplicate('employee', 'id'))
      else
      {
        commit(MutationType.addEmployee, employee)
        resolve(success.generic('employee', 'stored'))
      }
    })   
  },
  [ActionTypes.updateEmployee]({ commit }, employee)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (!getEmployee(state, employee.id)) reject(error.inexists('employee', 'id'))
      else
      {
        commit(MutationType.removeEmployee, employee)
        commit(MutationType.addEmployee, employee)
        resolve(success.generic('employee', 'updated'))
      }
    })  
  },
  [ActionTypes.deleteEmployee]({ commit }, employee)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (!getEmployee(state, employee.id)) reject(error.inexists('employee', 'id'))
      else
      {
        commit(MutationType.removeEmployee, employee)
        resolve(success.generic('employee', 'removed'))
      }
    })  
  },

  [ActionTypes.storeApproachModel]({ commit }, model)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (getApproachModel(state, model.title)) reject(error.duplicate('approach model', 'title'))
      else
      {
        commit(MutationType.addApproachModel, model)
        resolve(success.generic('approach model', 'stored'))
      }
    })  
  },
  [ActionTypes.updateApproachModel]({ commit }, model)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (!getApproachModel(state, model.title)) reject(error.inexists('approach model', 'title'))
      else
      {
        commit(MutationType.removeApproachModel, model)
        commit(MutationType.addApproachModel, model)
        resolve(success.generic('approach model', 'updated'))
      }
    })  
  },
  [ActionTypes.deleteApproachModel]({ commit }, model)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (!getApproachModel(state, model.title)) reject(error.inexists('approach model', 'title'))
      else
      {
        commit(MutationType.removeApproachModel, model)
        resolve(success.generic('approach model', 'removed'))
      }
    })  
  },

  [ActionTypes.storeCostCenter]({ commit }, costCenter)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (getCostCenter(state, costCenter.id)) reject(error.duplicate('cost center', 'id'))
      else
      {
        commit(MutationType.addCostCenter, costCenter)
        resolve(success.generic('cost center', 'stored'))
      }
    })  
  },
  [ActionTypes.updateCostCenter]({ commit }, costCenter)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (!getCostCenter(state, costCenter.id)) reject(error.inexists('cost center', 'id'))
      else
      {
        commit(MutationType.removeCostCenter, costCenter)
        commit(MutationType.addCostCenter, costCenter)
        resolve(success.generic('cost center', 'updated'))
      }
    })  
  },
  [ActionTypes.deleteCostCenter]({ commit }, costCenter)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (!getCostCenter(state, costCenter.id)) reject(error.inexists('cost center', 'id'))
      else
      {
        commit(MutationType.removeCostCenter, costCenter)
        resolve(success.generic('cost center', 'removed'))
      }
    })  
  },

  [ActionTypes.storeProject]({ commit }, project)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (getProject(state, project.id)) reject(error.duplicate('project', 'id'))
      else
      {
        commit(MutationType.addProject, project)
        resolve(success.generic('project', 'stored'))
      }
    }) 
  },
  [ActionTypes.updateProject]({ commit }, project)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (!getProject(state, project.id)) reject(error.inexists('project', 'id'))
      else
      {
        commit(MutationType.removeProject, project)
        commit(MutationType.addProject, project)
        resolve(success.generic('project', 'updated'))
      }
    })  
  },
  [ActionTypes.deleteProject]({ commit }, project)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (!getProject(state, project.id)) reject(error.inexists('project', 'id'))
      else
      {
        commit(MutationType.removeProject, project)
        resolve(success.generic('project', 'removed'))
      }
    })  
  },

  [ActionTypes.setNewProject]({ commit }, nullableProject)
  {
    return new Promise<string>((resolve, reject) =>
    {
      if (state.newProject != null && nullableProject != null) reject(error.singleton('new project'))
      else
      {
        commit(MutationType.assignNewProject, nullableProject)
        resolve(success.generic('new project', 'created'))
      }
    })  
  },
}