import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { Employee } from "@/classes/employee";
import { Project } from "@/classes/project";
import Nedb from "nedb";
import * as path from "path";

export enum EDatabases {
  projects = 'projects',
  approachModels = 'approachModels',
  costTypes = 'costTypes',
  employees = 'employees'
}

export type ProjectManagerDBs = {
  [EDatabases.projects]: Nedb,
  [EDatabases.approachModels]: Nedb,
  [EDatabases.costTypes]: Nedb,
  [EDatabases.employees]: Nedb
}

const databasePaths = {
  [EDatabases.projects]: path.join(window.path, [EDatabases.projects] + '.db'),
  [EDatabases.approachModels]: path.join(window.path, [EDatabases.approachModels] + '.db'),
  [EDatabases.costTypes]: path.join(window.path, [EDatabases.costTypes] + '.db'),
  [EDatabases.employees]: path.join(window.path, [EDatabases.employees] + '.db'),
}

export function useDatabase(): ProjectManagerDBs {
  return databases
}

const databases: ProjectManagerDBs = {
  [EDatabases.projects]: new Nedb({
    filename: databasePaths.projects,
    autoload: true,
    onload(error: Error | null) {
      if (error) console.error(`Error while loading the db '${[EDatabases.projects]}'`, error)
      databases[EDatabases.projects].find({}, (error: Error, docs: Array<Project>) => {
        // TODO: Init state with db data
      })
    }
  }),
  [EDatabases.approachModels]: new Nedb({
    filename: databasePaths.approachModels,
    autoload: true,
    onload(error: Error | null) {
      if (error) console.error(`Error while loading the db '${[EDatabases.approachModels]}'`, error)
      databases[EDatabases.approachModels].find({}, (error: Error, docs: Array<ApproachModel>) => {
        // TODO: Init state with db data
      })
    }
  }),
  [EDatabases.costTypes]: new Nedb({
    filename: databasePaths.costTypes,
    autoload: true,
    onload(error: Error | null) {
      if (error) console.error(`Error while loading the db '${[EDatabases.costTypes]}'`, error)
      databases[EDatabases.costTypes].find({}, (error: Error, docs: Array<CostType>) => {
        // TODO: Init state with db data
      })
    }
  }),
  [EDatabases.employees]: new Nedb({
    filename: databasePaths.employees,
    autoload: true,
    onload(error: Error | null) {
      if (error) console.error(`Error while loading the db '${[EDatabases.employees]}'`, error)
      databases[EDatabases.employees].find({}, (error: Error, docs: Array<Employee>) => {
        // TODO: Init state with db data
      })
    }
  })
}