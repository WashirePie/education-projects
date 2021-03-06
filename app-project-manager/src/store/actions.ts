import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { Employee } from "@/classes/employee";
import { Project } from "@/classes/project";
import { ClassConstructor, classToPlain, plainToClass } from "class-transformer";
import { ActionContext, ActionTree } from "vuex";
import { useDatabase } from "./db";
import { Mutations, MutationType } from "./mutations";
import { ProjectManagerState, state } from "./state";

const db = useDatabase()

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
  [ActionTypes.deleteEmployee](context: ActionAugments, employee: Employee): Promise<string>

  [ActionTypes.storeApproachModel](context: ActionAugments, model: ApproachModel): Promise<string>
  [ActionTypes.deleteApproachModel](context: ActionAugments, model: ApproachModel): Promise<string>

  [ActionTypes.storeCostType](context: ActionAugments, costType: CostType): Promise<string>
  [ActionTypes.deleteCostType](context: ActionAugments, costType: CostType): Promise<string>

  [ActionTypes.storeProject](context: ActionAugments, project: Project): Promise<string>
  [ActionTypes.deleteProject](context: ActionAugments, project: Project): Promise<string>

  [ActionTypes.setProjectToBePlanned](context: ActionAugments, nullableProject: Project | null): Promise<string>
  [ActionTypes.setProjectToBeManaged](context: ActionAugments, nullableProject: Project | null): Promise<string>
}

// Message generators
const successMessage = {
  generic: (type: string, action: string): string => `${type} was successfully ${action}`,
}

const errorMessage = {
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

      const callback = (dbError: Error | null, newDoc: unknown | null, updatedDoc: unknown | null) => {
        if (dbError) reject(dbError)
        else {
          if (newDoc) {
            commit(MutationType.addEmployee, plainToClass(Employee, newDoc))
            resolve(successMessage.generic('employee', 'stored'))
          } else if (updatedDoc) {
            const e = plainToClass(Employee, updatedDoc)
            commit(MutationType.removeEmployee, e)
            commit(MutationType.addEmployee, e)
            resolve(successMessage.generic('employee', 'updated'))
          } else {
            reject(new Error('No new or updated docs returned from database'))
          }
        }
      }

      const plainEmployee = classToPlain(employee)
      if (plainEmployee.hasOwnProperty('_id')) {
        db.employees.update({ _id: plainEmployee._id }, plainEmployee, { returnUpdatedDocs: true }, (error: Error | null, n: number, doc: unknown | null) => callback(error, null, doc))
      } else {
        if (getEmployee(state, employee.eId)) reject(errorMessage.duplicate('employee', 'id'))
        else db.employees.insert(plainEmployee, (error: Error | null, doc: unknown | null) => callback(error, doc, null))
      }
    })
  },
  [ActionTypes.deleteEmployee]({ commit }, employee) {
    return new Promise<string>((resolve, reject) => {
      if (!getEmployee(state, employee.eId)) reject(errorMessage.inexists('employee', 'id'))
      else {
        /* @ts-ignore */
        db.employees.remove({ _id: employee._id }, {}, (error: Error | null, numRemoved: number) => { if (error) reject(error) })
        commit(MutationType.removeEmployee, employee)
        resolve(successMessage.generic('employee', 'removed'))
      }
    })
  },

  [ActionTypes.storeApproachModel]({ commit }, model) {
    return new Promise<string>((resolve, reject) => {
      const callback = (dbError: Error | null, newDoc: unknown | null, updatedDoc: unknown | null) => {
        if (dbError) reject(dbError)
        else {
          if (newDoc) {
            commit(MutationType.addApproachModel, plainToClass(ApproachModel, newDoc))
            resolve(successMessage.generic('approach model', 'stored'))
          } else if (updatedDoc) {
            const m = plainToClass(ApproachModel, updatedDoc)
            commit(MutationType.removeApproachModel, m)
            commit(MutationType.addApproachModel, m)
            resolve(successMessage.generic('approach model', 'updated'))
          } else {
            reject(new Error('No new or updated docs returned from database'))
          }
        }
      }

      const plainModel = classToPlain(model)
      if (plainModel.hasOwnProperty('_id')) {
        db.approachModels.update({ _id: plainModel._id }, plainModel, { returnUpdatedDocs: true }, (error: Error | null, n: number, doc: unknown | null) => callback(error, null, doc))
      } else {
        if (getApproachModel(state, model.title)) reject(errorMessage.duplicate('approach model', 'title'))
        else db.approachModels.insert(plainModel, (error: Error | null, doc: unknown | null) => callback(error, doc, null))
      }
    })
  },
  [ActionTypes.deleteApproachModel]({ commit }, model) {
    return new Promise<string>((resolve, reject) => {
      if (!getApproachModel(state, model.title)) reject(errorMessage.inexists('approach model', 'title'))
      else {
        /* @ts-ignore */
        db.approachModels.remove({ _id: model._id }, {}, (error: Error | null, numRemoved: number) => { if (error) reject(error) })
        commit(MutationType.removeApproachModel, model)
        resolve(successMessage.generic('approach model', 'removed'))
      }
    })
  },

  [ActionTypes.storeCostType]({ commit }, costType) {
    return new Promise<string>((resolve, reject) => {
      const callback = (dbError: Error | null, newDoc: unknown | null, updatedDoc: unknown | null) => {
        if (dbError) reject(dbError)
        else {
          if (newDoc) {
            commit(MutationType.addCostType, plainToClass(CostType, newDoc))
            resolve(successMessage.generic('cost type', 'stored'))
          } else if (updatedDoc) {
            const ct = plainToClass(CostType, updatedDoc)
            commit(MutationType.removeCostType, ct)
            commit(MutationType.addCostType, ct)
            resolve(successMessage.generic('cost type', 'updated'))
          } else {
            reject(new Error('No new or updated docs returned from database'))
          }
        }
      }

      const plainCostType = classToPlain(costType)
      if (plainCostType.hasOwnProperty('_id')) {
        db.costTypes.update({ _id: plainCostType._id }, plainCostType, { returnUpdatedDocs: true }, (error: Error | null, n: number, doc: unknown | null) => callback(error, null, doc))
      } else {
        if (getCostType(state, costType.cId)) reject(errorMessage.duplicate('cost type', 'cId'))
        else db.costTypes.insert(plainCostType, (error: Error | null, doc: unknown | null) => callback(error, doc, null))
      }
    })
  },
  [ActionTypes.deleteCostType]({ commit }, costType) {
    return new Promise<string>((resolve, reject) => {
      if (!getCostType(state, costType.cId)) reject(errorMessage.inexists('cost center', 'id'))
      else {
        /* @ts-ignore */
        db.costTypes.remove({ _id: costType._id }, {}, (error: Error | null, numRemoved: number) => { if (error) reject(error) })
        commit(MutationType.removeCostType, costType)
        resolve(successMessage.generic('cost center', 'removed'))
      }
    })
  },

  [ActionTypes.storeProject]({ commit }, project) {
    return new Promise<string>((resolve, reject) => {
      const callback = (dbError: Error | null, newDoc: unknown | null, updatedDoc: unknown | null) => {
        if (dbError) reject(dbError)
        else {
          if (newDoc) {
            commit(MutationType.addProject, plainToClass(Project, newDoc))
            resolve(successMessage.generic('project', 'stored'))
          } else if (updatedDoc) {
            const p = plainToClass(Project, updatedDoc)
            commit(MutationType.removeProject, p)
            commit(MutationType.addProject, p)
            resolve(successMessage.generic('project', 'updated'))
          } else {
            reject(new Error('No new or updated docs returned from database'))
          }
        }
      }

      const plainProject = classToPlain(project)
      if (plainProject.hasOwnProperty('_id')) {
        db.projects.update({ _id: plainProject._id }, plainProject, { returnUpdatedDocs: true }, (error: Error | null, n: number, doc: unknown | null) => callback(error, null, doc))
      } else {
        if (getProject(state, project.pId)) reject(errorMessage.duplicate('project', 'pId'))
        else db.projects.insert(plainProject, (error: Error | null, doc: unknown | null) => callback(error, doc, null))
      }
    })
  },
  [ActionTypes.deleteProject]({ commit }, project) {
    return new Promise<string>((resolve, reject) => {
      if (!getProject(state, project.pId)) reject(errorMessage.inexists('project', 'id'))
      else {
        /* @ts-ignore */
        db.projects.remove({ _id: project._id }, {}, (error: Error | null, numRemoved: number) => { if (error) reject(error) })
        commit(MutationType.removeProject, project)
        resolve(successMessage.generic('project', 'removed'))
      }
    })
  },

  [ActionTypes.setProjectToBePlanned]({ commit }, nullableProject) {
    return new Promise<string>((resolve, reject) => {
      if (state.projectToBePlanned != null && nullableProject != null) reject(errorMessage.singleton('project to be planned'))
      else if (nullableProject && getProject(state, nullableProject.pId)) reject(errorMessage.duplicate('project', 'id'))
      else {
        commit(MutationType.assignProjectToBePlanned, nullableProject)
        resolve(successMessage.generic('project to be planned', 'created'))
      }
    })
  },

  [ActionTypes.setProjectToBeManaged]({ commit }, nullableProject) {
    return new Promise<string>((resolve, reject) => {
      if (state.projectToBeManaged != null && nullableProject != null) reject(errorMessage.singleton('project to be executed'))
      else {
        commit(MutationType.assignProjectToBeManaged, nullableProject)
        resolve(successMessage.generic('project to be executed', 'assigned'))
      }
    })
  }
}