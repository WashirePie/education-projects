import { ApproachModel } from "@/interfaces/approachModel";
import { CostCenter } from "@/interfaces/costCenter";
import { Employee } from "@/interfaces/employee";
import { Project } from "@/interfaces/project";
import { MutationTree } from "vuex";
import { ProjectManagerState } from "./state";

export enum MutationType
{
  addEmployee = "ADD_EMPLOYEE",
  removeEmployee = "REMOVE_EMPLOYEE",

  addApproachModel = "ADD_APPROACHMODEL",
  removeApproachModel = "REMOVE_APPROACHMODEL",

  addCostCenter = "ADD_COSTCENTER",
  removeCostCenter = "REMOVE_COSTCENTER",

  addProject = "ADD_PROJECTS",
  removeProject = "REMOVE_PROJECTS",
  assignNewProject = "ASSIGN_NEW_PROJECT",
}

export type Mutations = {
  [MutationType.addEmployee](state: ProjectManagerState, employee: Employee): void
  [MutationType.removeEmployee](state: ProjectManagerState, employee: Employee): void

  [MutationType.addApproachModel](state: ProjectManagerState, model: ApproachModel): void
  [MutationType.removeApproachModel](state: ProjectManagerState, model: ApproachModel): void

  [MutationType.addCostCenter](state: ProjectManagerState, costCenter: CostCenter): void
  [MutationType.removeCostCenter](state: ProjectManagerState, costCenter: CostCenter): void

  [MutationType.addProject](state: ProjectManagerState, project: Project): void
  [MutationType.removeProject](state: ProjectManagerState, project: Project): void
  [MutationType.assignNewProject](state: ProjectManagerState, project: Partial<Project>): void
}

export const mutations: MutationTree<ProjectManagerState> & Mutations = {
  [MutationType.addEmployee](state, employee) { state.employees.push(employee) },
  [MutationType.removeEmployee](state, employee) { state.employees = state.employees.filter( e => e.id != employee.id )},

  [MutationType.addApproachModel](state, model) { state.approachModels.push(model) },
  [MutationType.removeApproachModel](state, model) { state.approachModels = state.approachModels.filter(a => a.title != model.title) },

  [MutationType.addCostCenter](state, costCenter) { state.costCenters.push(costCenter) },
  [MutationType.removeCostCenter](state, costCenter) { state.costCenters = state.costCenters.filter(c => c.id != costCenter.id) },

  [MutationType.addProject](state, project) { state.projects.push(project) },
  [MutationType.removeProject](state, project) { state.projects = state.projects.filter(p => p.id != project.id) },
  [MutationType.assignNewProject](state, newProject) { state.newProject = newProject },
}