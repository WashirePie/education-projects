import { ApproachModel } from "@/interfaces/approachModel";
import { CostCenter } from "@/interfaces/costCenter";
import { Employee, EmployeeFunction } from "@/interfaces/employee";
import { Project } from "@/interfaces/project";

export type ProjectManagerState =
{
  employeeFunctions: Array<EmployeeFunction>
  employees: Array<Employee>
  approachModels: Array<ApproachModel>
  costCenters: Array<CostCenter>
  projects: Array<Project>
  newProject: Partial<Project> | null
}

/* TODO: Will be taken from db */
export const state: ProjectManagerState = {
  /* 'employeeFunctions' are hardcoded and immutable. This could easily be moved to a database. */
  employeeFunctions: [
    { name: 'Developer',     note: 'Available for developer functions' },
    { name: 'Designer',      note: 'Available for designer functions' },
    { name: 'Project Lead',  note: 'Available as project lead' },
    { name: 'Administrator', note: 'Available for administrative functions' }
  ] as Array<EmployeeFunction>,

  employees: [] as Array<Employee>,

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

  newProject: null as Partial<Project> | null,
}