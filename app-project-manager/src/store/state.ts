import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { DocumentRef } from "@/classes/document";
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "@/classes/employee";
import { EProjectPriority, EProjectState, Project } from "@/classes/project";
import { ExternalCostResource, PersonnelResource } from "@/classes/resource";

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

// TODO: Take data from db
// TODO: Move sample data to 'setupTests.ts'
/*
 * ----------------------------- Sample Data -----------------------------
 */
const employeeFunctions: Array<IEmployeeFunction> = [
  { name: EEmployeeFunctions.Developer, note: 'Available for developer functions' },
  { name: EEmployeeFunctions.Designer, note: 'Available for designer functions' },
  { name: EEmployeeFunctions.ProjectLead, note: 'Available as project lead' },
  { name: EEmployeeFunctions.Administrator, note: 'Available for administrative functions' }
]

const costTypeOne = new CostType('Outsourced Development', 'CT000')
const costTypeTwo = new CostType('Outsourced Design', 'CT200')
const costTypeThree = new CostType('Outsourced Testing', 'CT210')
const costTypeFour = new CostType('Consultancy Work', 'CT220')

const HERMES: ApproachModel = new ApproachModel('HERMES', ['Initialization', 'Concept', 'Realization', 'Introduction'])
const IPDRCE: ApproachModel = new ApproachModel('IPDRCE', ['Inform', 'Plan', 'Decide', 'Realize', 'Control', 'Evaluate'])

const employeeMax: Employee = new Employee('Max', 'Muster', 'Development', '#99999', 40, [employeeFunctions[0], employeeFunctions[3]])
const employeeBob: Employee = new Employee('Bob', 'Muster', 'Administration', '#99998', 30, [employeeFunctions[2], employeeFunctions[3]])
const employeeEve: Employee = new Employee('Eve', 'Muster', 'Product Design', '#99997', 42, [employeeFunctions[1]])
const employeeJil: Employee = new Employee('Jil', 'Muster', 'Development', '#99996', 10, [employeeFunctions[0], employeeFunctions[2], employeeFunctions[3]])

const projects: Array<Project> = [
  new Project('A Project', 'P444', IPDRCE, 'A sample project.', new Date(`1-1-21`), EProjectPriority.ABOVE_AVERAGE, employeeJil),
  new Project('A planned Project', 'P999', HERMES, 'A third basic sample Project', new Date(`1-2-21`), EProjectPriority.LOW, employeeBob),
  new Project('A denied Project', 'P998', HERMES, 'A very basic sample Project', new Date(`1-3-21`), EProjectPriority.NORMAL, employeeBob),
  new Project('Sample Project', 'P997', IPDRCE, 'Another basic sample Project', new Date(`1-4-21`), EProjectPriority.HIGH, employeeJil),
  new Project('Example Project', 'P996', HERMES, 'A third basic sample Project', new Date(`1-5-21`), EProjectPriority.LOW, employeeBob),
  new Project('Demo Project', 'P995', HERMES, 'A third basic sample Project', new Date(`1-6-21`), EProjectPriority.LOW, employeeBob)
]

projects.forEach((proj, j) => {
  proj.phases.forEach((p, i) => p.setStartDate(new Date(`1-${j + i + 1}-21`), proj))

  proj.phases.forEach((p, i) => p.addActivity(
    `Sample Activity ${j}.${i + 1}`,
    new Date(`1-${j + i + 2}-21`),
    new Date(`1-${j + i + 3}-21`),
    [
      new PersonnelResource('Make Timetable', 10, EEmployeeFunctions.Administrator, employeeMax),
      new ExternalCostResource('Review Timetable', 5, costTypeFour)
    ],
    employeeJil
  ))

  proj.phases.forEach((p, i) => p.addActivity(
    `Sample Activity ${j}.${i + 2}`,
    new Date(`1-${j + i + 3}-21`),
    new Date(`1-${j + i + 4}-21`),
    [
      new PersonnelResource('Make Something else', 10, EEmployeeFunctions.Administrator, employeeMax),
      new ExternalCostResource('Review Something else', 5, costTypeFour)
    ],
    employeeJil
  ))

  proj.phases.forEach((p, i) => p.addActivity(
    `Sample Activity ${j}.${i + 3}`,
    new Date(`1-${j + i + 4}-21`),
    new Date(`1-${j + i + 5}-21`),
    [
      new PersonnelResource('Make Another thing', 10, EEmployeeFunctions.Administrator, employeeMax),
      new ExternalCostResource('Review Another thing', 5, costTypeFour)
    ],
    employeeJil
  ))

  proj.phases.forEach((p, i) => p.addMilestone(
    `Sample Milestone ${j}.${i + 1}`,
    [p.activities[0].id, p.activities[1].id, p.activities[2].id]
  ))

  proj.phases.forEach((p, i) => p.documents.push(new DocumentRef(
    `MyFile_${j}_${i}`,
    `C:/home/user/MyFile_${j}_${i}.md`,
    '.md'
  )))

})

// Pick out project-to-be-planned
const sampleProjectToBePlanned = projects.shift()

// Set other projects to be planned
projects.forEach(proj => {
  proj.phases.forEach(p => p.plan(proj))
  proj.plan()
})

// Pick out planned-project and  denied project
const plannedProject = projects.shift()
const deniedProject = projects.shift()
deniedProject?.approve(false)

// Approve other projects
projects.forEach(proj => proj.approve())

// Set arbitrary progress values
projects.forEach(proj => {
  proj.phases.forEach(p => {
    p.activities.forEach(a => a.progress = Math.random() * 100)
  })
})

// Pick out project-to-be-managed
const sampleProjectToBeManaged = projects[0]

// Add othe projects back in
projects.push(deniedProject!)
projects.push(plannedProject!)

/*
 * ----------------------------- /Sample Data -----------------------------
 */


export const state: ProjectManagerState = {
  // 'employeeFunctions' are hardcoded and immutable. This could easily be moved to a database.
  employeeFunctions,

  employees: <Array<Employee>>[
    employeeMax,
    employeeBob,
    employeeEve,
    employeeJil,
  ],

  approachModels: <Array<ApproachModel>>[
    HERMES,
    IPDRCE,
  ],

  costTypes: <Array<CostType>>[
    costTypeOne,
    costTypeTwo,
    costTypeThree,
    costTypeFour,
  ],

  projects: <Array<Project>>projects,

  projectToBePlanned: sampleProjectToBePlanned!,
  projectToBeManaged: sampleProjectToBeManaged
}