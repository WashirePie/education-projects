import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "@/classes/employee";
import { Project } from "@/classes/project";
import { useSampleData } from "@/store/sampleData";
import { useDatabase } from "./db";

export type ProjectManagerState =
  {
    employeeFunctions: Array<IEmployeeFunction>
    employees: Array<Employee>
    approachModels: Array<ApproachModel>
    costTypes: Array<CostType>
    projects: Array<Project>
    projectToBePlanned: Project | null
    projectToBeManaged: Project | null
  }

const db = useDatabase()
// TODO: Take data from db
// TODO: Move sample data to 'setupTests.ts'

const employeeFunctions: Array<IEmployeeFunction> = [
  { name: EEmployeeFunctions.Developer, note: 'Available for developer functions' },
  { name: EEmployeeFunctions.Designer, note: 'Available for designer functions' },
  { name: EEmployeeFunctions.ProjectLead, note: 'Available as project lead' },
  { name: EEmployeeFunctions.Administrator, note: 'Available for administrative functions' }
]

const sampleData = useSampleData()
db.approachModels.insert(sampleData.approachModels, (error: Error | null) => { if (error) window.dialog.showErrorBox("Error while inserting sample approach models", error!.message) })
db.projects.insert(sampleData.projects, (error: Error | null) => { if (error) window.dialog.showErrorBox("Error while inserting sample projects", error!.message) })
db.costTypes.insert(sampleData.costTypes, (error: Error | null) => { if (error) window.dialog.showErrorBox("Error while inserting sample cost types", error!.message) })
db.employees.insert(sampleData.employees, (error: Error | null) => { if (error) window.dialog.showErrorBox("Error while inserting sample employee", error!.message) })

export const state: ProjectManagerState = {
  // 'employeeFunctions' are hardcoded and immutable. This could easily be moved to a database.
  employeeFunctions,

  employees: [],
  approachModels: [],
  costTypes: [],
  projects: [],

  projectToBePlanned: sampleData.sampleProjectToBePlanned!,
  projectToBeManaged: sampleData.sampleProjectToBeManaged
}