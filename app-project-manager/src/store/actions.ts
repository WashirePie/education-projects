import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { Employee } from "@/classes/employee";
import { Project } from "@/classes/project";
import { ActionContext, ActionTree } from "vuex";
import { Mutations, MutationType } from "./mutations";
import { ProjectManagerState, state } from "./state";

export enum ActionTypes {
  storeEmployee = "STORE_EMPLOYEE",
  updateEmployee = "UPDATE_EMPLOYEE",
  deleteEmployee = "DELETE_EMPLOYEE",
  storeApproachModel = "STORE_APPROACHMODEL",
  updateApproachModel = "UPDATE_APPROACHMODEL",
  deleteApproachModel = "DELETE_APPROACHMODEL",
  storeCostType = "STORE_COSTTYPE",
  updateCostType = "UPDATE_COSTTYPE",
  deleteCostType = "DELETE_COSTTYPE",
  storeProject = "STORE_PROJECT",
  updateProject = "UPDATE_PROJECT",
  deleteProject = "DELETE_PROJECT",

  setProjectToBePlanned = "SET_PROJECT_TO_BE_PLANNED",
  setProjectToBeManaged = "SET_PROJECT_TO_BE_EXECUTED",
}

type ActionAugments = Omit<ActionContext<ProjectManagerState, ProjectManagerState>, 'commit'> &
{
  commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]):
    ReturnType<Mutations[K]>
}

export type Actions = {
  [ActionTypes.storeEmployee](context: ActionAugments, employee: Employee): Promise<string>
  [ActionTypes.updateEmployee](context: ActionAugments, employee: Employee): Promise<string>
  [ActionTypes.deleteEmployee](context: ActionAugments, employee: Employee): Promise<string>

  [ActionTypes.storeApproachModel](context: ActionAugments, model: ApproachModel): Promise<string>
  [ActionTypes.updateApproachModel](context: ActionAugments, model: ApproachModel): Promise<string>
  [ActionTypes.deleteApproachModel](context: ActionAugments, model: ApproachModel): Promise<string>

  [ActionTypes.storeCostType](context: ActionAugments, costType: CostType): Promise<string>
  [ActionTypes.updateCostType](context: ActionAugments, costType: CostType): Promise<string>
  [ActionTypes.deleteCostType](context: ActionAugments, costType: CostType): Promise<string>

  [ActionTypes.storeProject](context: ActionAugments, project: Project): Promise<string>
  [ActionTypes.updateProject](context: ActionAugments, project: Project): Promise<string>
  [ActionTypes.deleteProject](context: ActionAugments, project: Project): Promise<string>

  [ActionTypes.setProjectToBePlanned](context: ActionAugments, nullableProject: Project | null): Promise<string>
  [ActionTypes.setProjectToBeManaged](context: ActionAugments, nullableProject: Project | null): Promise<string>
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
const getEmployee = (state: ProjectManagerState, id: Employee['eId']): Employee | undefined =>
  state.employees.filter(e => e.eId === id)[0]

const getApproachModel = (state: ProjectManagerState, title: ApproachModel['title']): ApproachModel | undefined =>
  state.approachModels.filter(a => a.title === title)[0]

const getCostType = (state: ProjectManagerState, id: CostType['cId']): CostType | undefined =>
  state.costTypes.filter(c => c.cId === id)[0]

const getProject = (state: ProjectManagerState, id: Project['pId']): Project | undefined =>
  state.projects.filter(p => p.pId === id)[0]

export const actions: ActionTree<ProjectManagerState, ProjectManagerState> & Actions = {
  [ActionTypes.storeEmployee]({ commit }, employee) {
    return new Promise<string>((resolve, reject) => {
      if (getEmployee(state, employee.eId)) reject(error.duplicate('employee', 'id'))
      else {
        commit(MutationType.addEmployee, employee)
        resolve(success.generic('employee', 'stored'))
      }
    })
  },
  [ActionTypes.updateEmployee]({ commit }, employee) {
    return new Promise<string>((resolve, reject) => {
      if (!getEmployee(state, employee.eId)) reject(error.inexists('employee', 'id'))
      else {
        commit(MutationType.removeEmployee, employee)
        commit(MutationType.addEmployee, employee)
        resolve(success.generic('employee', 'updated'))
      }
    })
  },
  [ActionTypes.deleteEmployee]({ commit }, employee) {
    return new Promise<string>((resolve, reject) => {
      if (!getEmployee(state, employee.eId)) reject(error.inexists('employee', 'id'))
      else {
        commit(MutationType.removeEmployee, employee)
        resolve(success.generic('employee', 'removed'))
      }
    })
  },

  [ActionTypes.storeApproachModel]({ commit }, model) {
    return new Promise<string>((resolve, reject) => {
      if (getApproachModel(state, model.title)) reject(error.duplicate('approach model', 'title'))
      else {
        commit(MutationType.addApproachModel, model)
        resolve(success.generic('approach model', 'stored'))
      }
    })
  },
  [ActionTypes.updateApproachModel]({ commit }, model) {
    return new Promise<string>((resolve, reject) => {
      if (!getApproachModel(state, model.title)) reject(error.inexists('approach model', 'title'))
      else {
        commit(MutationType.removeApproachModel, model)
        commit(MutationType.addApproachModel, model)
        resolve(success.generic('approach model', 'updated'))
      }
    })
  },
  [ActionTypes.deleteApproachModel]({ commit }, model) {
    return new Promise<string>((resolve, reject) => {
      if (!getApproachModel(state, model.title)) reject(error.inexists('approach model', 'title'))
      else {
        commit(MutationType.removeApproachModel, model)
        resolve(success.generic('approach model', 'removed'))
      }
    })
  },

  [ActionTypes.storeCostType]({ commit }, costType) {
    return new Promise<string>((resolve, reject) => {
      if (getCostType(state, costType.cId)) reject(error.duplicate('cost center', 'id'))
      else {
        commit(MutationType.addCostType, costType)
        resolve(success.generic('cost center', 'stored'))
      }
    })
  },
  [ActionTypes.updateCostType]({ commit }, costType) {
    return new Promise<string>((resolve, reject) => {
      if (!getCostType(state, costType.cId)) reject(error.inexists('cost center', 'id'))
      else {
        commit(MutationType.removeCostType, costType)
        commit(MutationType.addCostType, costType)
        resolve(success.generic('cost center', 'updated'))
      }
    })
  },
  [ActionTypes.deleteCostType]({ commit }, costType) {
    return new Promise<string>((resolve, reject) => {
      if (!getCostType(state, costType.cId)) reject(error.inexists('cost center', 'id'))
      else {
        commit(MutationType.removeCostType, costType)
        resolve(success.generic('cost center', 'removed'))
      }
    })
  },

  [ActionTypes.storeProject]({ commit }, project) {
    return new Promise<string>((resolve, reject) => {
      if (getProject(state, project.pId)) reject(error.duplicate('project', 'id'))
      else {
        commit(MutationType.addProject, project)
        resolve(success.generic('project', 'stored'))
      }
    })
  },
  [ActionTypes.updateProject]({ commit }, project) {
    return new Promise<string>((resolve, reject) => {
      if (!getProject(state, project.pId)) reject(error.inexists('project', 'id'))
      else {
        commit(MutationType.removeProject, project)
        commit(MutationType.addProject, project)
        resolve(success.generic('project', 'updated'))
      }
    })
  },
  [ActionTypes.deleteProject]({ commit }, project) {
    return new Promise<string>((resolve, reject) => {
      if (!getProject(state, project.pId)) reject(error.inexists('project', 'id'))
      else {
        commit(MutationType.removeProject, project)
        resolve(success.generic('project', 'removed'))
      }
    })
  },

  [ActionTypes.setProjectToBePlanned]({ commit }, nullableProject) {
    return new Promise<string>((resolve, reject) => {
      if (state.projectToBePlanned != null && nullableProject != null) reject(error.singleton('project to be planned'))
      else if (nullableProject && getProject(state, nullableProject.pId)) reject(error.duplicate('project', 'id'))
      else {
        commit(MutationType.assignProjectToBePlanned, nullableProject)
        resolve(success.generic('project to be planned', 'created'))
      }
    })
  },

  [ActionTypes.setProjectToBeManaged]({ commit }, nullableProject) {
    return new Promise<string>((resolve, reject) => {
      if (state.projectToBeManaged != null && nullableProject != null) reject(error.singleton('project to be executed'))
      else {
        commit(MutationType.assignProjectToBeManaged, nullableProject)
        resolve(success.generic('project to be executed', 'assigned'))
      }
    })
  }
}