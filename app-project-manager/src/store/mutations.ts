import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { Employee } from "@/classes/employee";
import { Phase } from "@/classes/phase";
import { Project } from "@/classes/project";
import { MutationTree } from "vuex";
import { ProjectManagerState } from "./state";

export enum MutationType
{
  addEmployee = "ADD_EMPLOYEE",
  removeEmployee = "REMOVE_EMPLOYEE",

  addApproachModel = "ADD_APPROACHMODEL",
  removeApproachModel = "REMOVE_APPROACHMODEL",

  addCostType = "ADD_COSTTYPE",
  removeCostType = "REMOVE_COSTTYPE",

  addProject = "ADD_PROJECTS",
  removeProject = "REMOVE_PROJECTS",

  assignProjectToBePlanned = "ASSIGN_PROJECT_TO_BE_PLANNED",
}

export type Mutations = {
  [MutationType.addEmployee](state: ProjectManagerState, employee: Employee): void
  [MutationType.removeEmployee](state: ProjectManagerState, employee: Employee): void

  [MutationType.addApproachModel](state: ProjectManagerState, model: ApproachModel): void
  [MutationType.removeApproachModel](state: ProjectManagerState, model: ApproachModel): void

  [MutationType.addCostType](state: ProjectManagerState, costType: CostType): void
  [MutationType.removeCostType](state: ProjectManagerState, costType: CostType): void

  [MutationType.addProject](state: ProjectManagerState, project: Project): void
  [MutationType.removeProject](state: ProjectManagerState, project: Project): void

  [MutationType.assignProjectToBePlanned](state: ProjectManagerState, nullableProject: Project | null): void
}

export const mutations: MutationTree<ProjectManagerState> & Mutations = {
  [MutationType.addEmployee](state, employee) { state.employees.push(employee) },
  [MutationType.removeEmployee](state, employee) { state.employees = state.employees.filter( e => e.id != employee.id )},

  [MutationType.addApproachModel](state, model) { state.approachModels.push(model) },
  [MutationType.removeApproachModel](state, model) { state.approachModels = state.approachModels.filter(a => a.title != model.title) },

  [MutationType.addCostType](state, costType) { state.costTypes.push(costType) },
  [MutationType.removeCostType](state, costType) { state.costTypes = state.costTypes.filter(c => c.id != costType.id) },

  [MutationType.addProject](state, project) { state.projects.push(project) },
  [MutationType.removeProject](state, project) { state.projects = state.projects.filter(p => p.id != project.id) },

  [MutationType.assignProjectToBePlanned](state, nullableProject) { state.projectToBePlanned = nullableProject },
}