import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { Employee } from "@/classes/employee";
import { Project } from "@/classes/project";
import { plainToClass } from "class-transformer";
import Nedb from "nedb";
import * as path from "path";
import { store } from ".";

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
      if (error) window.dialog.showErrorBox(`Error while loading the '${[EDatabases.projects]}' database`, error.message)

      // Get all stored projects
      databases[EDatabases.projects].find({}, (error: Error, docs: Array<object>) => {
        if (error) window.dialog.showErrorBox(`Error while loading data from the '${[EDatabases.projects]} database'`, error.message)
        try {
          store.state.projects = plainToClass(Project, docs)
        } catch (error) {
          if (error) window.dialog.showErrorBox(`Error casting data from the '${[EDatabases.projects]} database'`, error.message)
        }
      })
    }
  }),
  [EDatabases.approachModels]: new Nedb({
    filename: databasePaths.approachModels,
    autoload: true,
    onload(error: Error | null) {
      if (error) window.dialog.showErrorBox(`Error while loading the '${[EDatabases.approachModels]}' database`, error.message)

      // Get all stored approach modesl
      databases[EDatabases.approachModels].find({}, (error: Error, docs: Array<object>) => {
        if (error) window.dialog.showErrorBox(`Error while loading data from the '${[EDatabases.approachModels]} database'`, error.message)
        try {
          store.state.approachModels = plainToClass(ApproachModel, docs)
        } catch (error) {
          if (error) window.dialog.showErrorBox(`Error casting data from the '${[EDatabases.approachModels]} database'`, error.message)
        }
      })
    }
  }),
  [EDatabases.costTypes]: new Nedb({
    filename: databasePaths.costTypes,
    autoload: true,
    onload(error: Error | null) {
      if (error) window.dialog.showErrorBox(`Error while loading the '${[EDatabases.costTypes]}' database`, error.message)

      // Get all stored cost types
      databases[EDatabases.costTypes].find({}, (error: Error, docs: Array<object>) => {
        if (error) window.dialog.showErrorBox(`Error while loading data from the '${[EDatabases.costTypes]} database'`, error.message)
        try {
          store.state.costTypes = plainToClass(CostType, docs)
        } catch (error) {
          if (error) window.dialog.showErrorBox(`Error casting data from the '${[EDatabases.costTypes]} database'`, error.message)
        }
      })
    }
  }),
  [EDatabases.employees]: new Nedb({
    filename: databasePaths.employees,
    autoload: true,
    onload(error: Error | null) {
      if (error) window.dialog.showErrorBox(`Error while loading the '${[EDatabases.employees]}' database`, error.message)

      // Get all stored employees
      databases[EDatabases.employees].find({}, (error: Error, docs: Array<object>) => {
        if (error) window.dialog.showErrorBox(`Error while loading data from the '${[EDatabases.employees]} database'`, error.message)
        try {
          store.state.employees = plainToClass(Employee, docs)
        } catch (error) {
          if (error) window.dialog.showErrorBox(`Error casting data from the '${[EDatabases.employees]} database'`, error.message)
        }
      })
    }
  })
}