import { Activity } from "@/classes/activity";
import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "@/classes/employee";
import { Project } from "@/classes/project";
import { useSampleData } from "@/store/sampleData";
import { classToPlain, plainToClass } from "class-transformer";
import { debugPort } from "process";
import { store } from ".";
import { EDatabases, useDatabase } from "./db";

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

let projectToBePlanned: Project | null = null
let projectToBeManaged: Project | null = null

const sampleData = useSampleData()

if (process.env.NODE_ENV !== "production") {
  // Clear approach model database and insert sample data
  db.approachModels.remove({}, { multi: true }, (error: Error | null) => {
    if (error) console.error(`Error while erasing '${EDatabases.approachModels}' database`, error);
    db.approachModels.loadDatabase((error: Error | null) => {
      if (error) console.error(`Error while erasing '${EDatabases.approachModels}' database`, error);
    })
  });
  const models = classToPlain(sampleData.approachModels)
  db.approachModels.insert(models, (error: Error | null) => { if (error) window.dialog.showErrorBox("Error while inserting sample approach models", error!.message) })

  // Clear projects database and insert sample data
  db.projects.remove({}, { multi: true }, (error: Error | null) => {
    if (error) console.error(`Error while erasing '${EDatabases.projects}' database`, error);
    db.projects.loadDatabase((error: Error | null) => {
      if (error) console.error(`Error while erasing '${EDatabases.projects}' database`, error);
    })
  });
  const projects = classToPlain(sampleData.projects)
  db.projects.insert(projects, (error: Error | null) => { if (error) window.dialog.showErrorBox("Error while inserting sample projects", error!.message) })

  // Clear cost types database and insert sample data
  db.costTypes.remove({}, { multi: true }, (error: Error | null) => {
    if (error) console.error(`Error while erasing '${EDatabases.costTypes}' database`, error);
    db.costTypes.loadDatabase((error: Error | null) => {
      if (error) console.error(`Error while erasing '${EDatabases.costTypes}' database`, error);
    })
  });
  const costTypes = classToPlain(sampleData.costTypes)
  db.costTypes.insert(costTypes, (error: Error | null) => { if (error) window.dialog.showErrorBox("Error while inserting sample cost types", error!.message) })

  // Clear employees database and insert sample data
  db.employees.remove({}, { multi: true }, (error: Error | null) => {
    if (error) console.error(`Error while erasing '${EDatabases.employees}' database`, error);
    db.employees.loadDatabase((error: Error | null) => {
      if (error) console.error(`Error while erasing '${EDatabases.employees}' database`, error);
    })
  });
  const employees = classToPlain(sampleData.employees)
  db.employees.insert(employees, (error: Error | null) => { if (error) window.dialog.showErrorBox("Error while inserting sample employee", error!.message) })

  // Use sample projects to invoke planner & manager module
  // TODO: These need a nedb _id - otherwise it'll fail on saving since it thinks it's a new project
  // projectToBePlanned = sampleData.sampleProjectToBePlanned!
  // projectToBeManaged = sampleData.sampleProjectToBeManaged
}

export const state: ProjectManagerState = {
  // 'employeeFunctions' are hardcoded and immutable. This could easily be moved to a database.
  employeeFunctions,

  employees: [],
  approachModels: [],
  costTypes: [],
  projects: [],

  projectToBePlanned,
  projectToBeManaged
}