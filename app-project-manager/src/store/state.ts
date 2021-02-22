import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { DocumentRef } from "@/classes/document";
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "@/classes/employee";
import { Phase } from "@/classes/phase";
import { EProjectPriority, Project } from "@/classes/project";
import { ExternalCostResource, PersonnelResource } from "@/classes/resource";

export type ProjectManagerState =
{
  employeeFunctions: Array<IEmployeeFunction>
  employees: Array<Employee>
  approachModels: Array<ApproachModel>
  costTypes: Array<CostType>
  projects: Array<Project>
  projectToBePlanned: Project | null
  phaseToBePlanned: Phase | null
}

// TODO: Take data from db
// TODO: Move sample data to 'setupTests.ts'
/*
 * ----------------------------- Sample Data -----------------------------
 */
const employeeFunctions: Array<IEmployeeFunction> = [
  { name: EEmployeeFunctions.Developer,     note: 'Available for developer functions' },
  { name: EEmployeeFunctions.Designer,      note: 'Available for designer functions' },
  { name: EEmployeeFunctions.ProjectLead,   note: 'Available as project lead' },
  { name: EEmployeeFunctions.Administrator, note: 'Available for administrative functions' }
]

const costTypeOne   = new CostType('Outsourced Development', 'CT000')
const costTypeTwo   = new CostType('Outsourced Design',      'CT200')
const costTypeThree = new CostType('Outsourced Testing',     'CT210')
const costTypeFour  = new CostType('Consultancy Work',       'CT220')

const HERMES: ApproachModel = new ApproachModel('HERMES', ['Initialization', 'Concept', 'Realization', 'Introduction'] )
const IPDRCE: ApproachModel = new ApproachModel('IPDRCE', ['Inform', 'Plan', 'Decide', 'Realize', 'Control', 'Evaluate'] )

const employeeMax: Employee = new Employee('Max', 'Muster', 'Development',    '#99999', 40, [employeeFunctions[0], employeeFunctions[3]])
const employeeBob: Employee = new Employee('Bob', 'Muster', 'Administration', '#99998', 30, [employeeFunctions[2], employeeFunctions[3]])
const employeeEve: Employee = new Employee('Eve', 'Muster', 'Product Design', '#99997', 42, [employeeFunctions[1]])
const employeeJil: Employee = new Employee('Jil', 'Muster', 'Development',    '#99996', 10, [employeeFunctions[0], employeeFunctions[2], employeeFunctions[3]])

const projectOne   = new Project('Sample Project',  'P999', HERMES, 'A very basic sample Project', new Date(), EProjectPriority.NORMAL, employeeBob)
const projectTwo   = new Project('Another Project', 'P998', IPDRCE, 'Another basic sample Project', new Date(), EProjectPriority.HIGH, employeeJil)
const projectThree = new Project('A third Project',  'P997', HERMES, 'A third basic sample Project', new Date(), EProjectPriority.LOW, employeeBob)

const sampleProjectToBePlanned = new Project(
  'Sample Project', 
  'P444', 
  IPDRCE, 
  'A sample project in the planning state. Used to implement the <Planner> component.', 
  new Date('1-1-2021'),
  EProjectPriority.ABOVE_AVERAGE, 
  employeeJil
)

sampleProjectToBePlanned.phases[0].setStartDate(new Date('1-2-21'), sampleProjectToBePlanned)
sampleProjectToBePlanned.phases[1].setStartDate(new Date('1-14-21'), sampleProjectToBePlanned)
sampleProjectToBePlanned.phases[2].setStartDate(new Date('2-1-21'), sampleProjectToBePlanned)
sampleProjectToBePlanned.phases[3].setStartDate(new Date('2-15-21'), sampleProjectToBePlanned)
sampleProjectToBePlanned.phases[4].setStartDate(new Date('3-1-21'), sampleProjectToBePlanned)
sampleProjectToBePlanned.phases[5].setStartDate(new Date('4-2-21'), sampleProjectToBePlanned)

sampleProjectToBePlanned.phases[0].addActivity( 'Sample Activity 0', new Date('1-3-21'), new Date('2-1-21'), [ new PersonnelResource('Make Timetable', 40, EEmployeeFunctions.Administrator, employeeMax), new ExternalCostResource('Rewiev Timetable', 500, costTypeFour) ], employeeJil )
sampleProjectToBePlanned.phases[0].addActivity( 'Sample Activity 1', new Date('1-4-21'), new Date('1-9-21'), [ new PersonnelResource('Stakeholder Analysis', 120, EEmployeeFunctions.Administrator, employeeMax), new ExternalCostResource('Rewiev Analysis', 500, costTypeFour) ], employeeJil )
sampleProjectToBePlanned.phases[1].addActivity( 'Sample Activity 2', new Date('1-15-21'), new Date('1-29-21'), [ new PersonnelResource('Make Timetable', 40, EEmployeeFunctions.Administrator, employeeMax), new ExternalCostResource('Rewiev Timetable', 500, costTypeFour) ], employeeJil )
sampleProjectToBePlanned.phases[2].addActivity( 'Sample Activity 3', new Date('2-1-21'), new Date('2-20-21'), [ new PersonnelResource('Make Timetable', 40, EEmployeeFunctions.Administrator, employeeMax), new ExternalCostResource('Rewiev Timetable', 500, costTypeFour) ], employeeJil )
sampleProjectToBePlanned.phases[3].addActivity( 'Sample Activity 4', new Date('2-15-21'), new Date('2-28-21'), [ new PersonnelResource('Make Timetable', 40, EEmployeeFunctions.Administrator, employeeMax), new ExternalCostResource('Rewiev Timetable', 500, costTypeFour) ], employeeJil )
sampleProjectToBePlanned.phases[4].addActivity( 'Sample Activity 5', new Date('3-1-21'), new Date('3-25-21'), [ new PersonnelResource('Make Timetable', 40, EEmployeeFunctions.Administrator, employeeMax), new ExternalCostResource('Rewiev Timetable', 500, costTypeFour) ], employeeJil )
sampleProjectToBePlanned.phases[5].addActivity( 'Sample Activity 6', new Date('4-2-21'), new Date('4-20-21'), [ new PersonnelResource('Make Timetable', 40, EEmployeeFunctions.Administrator, employeeMax), new ExternalCostResource('Rewiev Timetable', 500, costTypeFour) ], employeeJil )

sampleProjectToBePlanned.phases[0].addMilestone('Sample Milestone', new Date('1-10-21'), [sampleProjectToBePlanned.phases[0].activities[0].id])
sampleProjectToBePlanned.phases[0].documents.push(new DocumentRef('MyFile', 'C:/Home/user/me/MyFile.md', '.md'))
/*
 * ----------------------------- /Sample Data -----------------------------
 */


export const state: ProjectManagerState = {
  /* 'employeeFunctions' are hardcoded and immutable. This could easily be moved to a database. */
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

  projects: <Array<Project>>[
    projectOne, 
    projectTwo, 
    projectThree,
  ],

  projectToBePlanned: sampleProjectToBePlanned,
  phaseToBePlanned: null,
}