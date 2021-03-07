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

// preload.ts does not when testing
const isTestEnv = process.env.NODE_ENV == 'test'
if (isTestEnv) window.path = ''

const databasePaths = {
  [EDatabases.projects]: path.join(window.path, [EDatabases.projects] + '.db'),
  [EDatabases.approachModels]: path.join(window.path, [EDatabases.approachModels] + '.db'),
  [EDatabases.costTypes]: path.join(window.path, [EDatabases.costTypes] + '.db'),
  [EDatabases.employees]: path.join(window.path, [EDatabases.employees] + '.db'),
}

export function useDatabase(): ProjectManagerDBs {
  return databases
}

// Databases will initialize the vuex state upon their onLoad event
const databases: ProjectManagerDBs = {
  [EDatabases.projects]: new Nedb({
    filename: databasePaths.projects,
    inMemoryOnly: isTestEnv,
    autoload: true,
    onload(error: Error | null) {
      if (error) window.dialog.showErrorBox(`Error while loading the '${[EDatabases.projects]}' database`, error.message)

      // Get all stored projects
      databases[EDatabases.projects].find({}, (error: Error, docs: Array<object>) => {
        if (error) window.dialog.showErrorBox(`Error while loading data from the '${[EDatabases.projects]} database'`, error.message)
        store.state.projects = plainToClass(Project, docs)
      })
    }
  }),
  [EDatabases.approachModels]: new Nedb({
    filename: databasePaths.approachModels,
    inMemoryOnly: isTestEnv,
    autoload: true,
    onload(error: Error | null) {
      if (error) window.dialog.showErrorBox(`Error while loading the '${[EDatabases.approachModels]}' database`, error.message)

      // Get all stored approach modesl
      databases[EDatabases.approachModels].find({}, (error: Error, docs: Array<object>) => {
        if (error) window.dialog.showErrorBox(`Error while loading data from the '${[EDatabases.approachModels]} database'`, error.message)
        store.state.approachModels = plainToClass(ApproachModel, docs)
      })
    }
  }),
  [EDatabases.costTypes]: new Nedb({
    filename: databasePaths.costTypes,
    inMemoryOnly: isTestEnv,
    autoload: true,
    onload(error: Error | null) {
      if (error) window.dialog.showErrorBox(`Error while loading the '${[EDatabases.costTypes]}' database`, error.message)

      // Get all stored cost types
      databases[EDatabases.costTypes].find({}, (error: Error, docs: Array<object>) => {
        if (error) window.dialog.showErrorBox(`Error while loading data from the '${[EDatabases.costTypes]} database'`, error.message)
        store.state.costTypes = plainToClass(CostType, docs)
      })
    }
  }),
  [EDatabases.employees]: new Nedb({
    filename: databasePaths.employees,
    inMemoryOnly: isTestEnv,
    autoload: true,
    onload(error: Error | null) {
      if (error) window.dialog.showErrorBox(`Error while loading the '${[EDatabases.employees]}' database`, error.message)

      // Get all stored employees
      databases[EDatabases.employees].find({}, (error: Error, docs: Array<object>) => {
        if (error) window.dialog.showErrorBox(`Error while loading data from the '${[EDatabases.employees]} database'`, error.message)
        store.state.employees = plainToClass(Employee, docs)
      })
    }
  })
}