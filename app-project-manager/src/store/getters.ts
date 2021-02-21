import { EEmployeeFunctions, Employee } from "@/classes/employee";
import { GetterTree } from "vuex";
import { ProjectManagerState } from "./state";

export type Getters = {
  availableProjectLeads(state: ProjectManagerState): Array<Employee>
}

export const getters: GetterTree<ProjectManagerState, ProjectManagerState> & Getters = {
  availableProjectLeads(state): Array<Employee>
  {
    return state.employees.filter(e => 
      e.possibleFunctions.some(f => f.name == EEmployeeFunctions.ProjectLead))
  }
}