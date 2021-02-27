import { EEmployeeFunctions, Employee } from "@/classes/employee";
import { Project } from "@/classes/project";
import { GetterTree } from "vuex";
import { ProjectManagerState } from "./state";

export type Getters = {
  availableProjectLeads(state: ProjectManagerState): Array<Employee>
  sortedProjects(state: ProjectManagerState): Array<Project>
  waitingProjectsCount(state: ProjectManagerState): number
}

export const getters: GetterTree<ProjectManagerState, ProjectManagerState> & Getters = {
  availableProjectLeads(state): Array<Employee> {
    return state.employees.filter(e =>
      e.possibleFunctions.some(f => f.name == EEmployeeFunctions.ProjectLead))
  },
  sortedProjects(state): Array<Project> {
    const byTitle = (a: Project, b: Project) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0

    return state.projects.sort(byTitle)
  },
  waitingProjectsCount(state): number { return state.projects.filter(p => p.isAwaitingApproval).length }
}