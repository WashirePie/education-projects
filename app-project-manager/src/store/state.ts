import { Activity } from "@/interfaces/activity";
import { ApproachModel } from "@/interfaces/approachModel";
import { CostCenter } from "@/interfaces/costCenter";
import { Employee, EmployeeFunction } from "@/interfaces/employee";
import { Milestone } from "@/interfaces/milestone";
import { Phase } from "@/interfaces/phase";
import { EProjectPriority, EProjectState, Project } from "@/interfaces/project";
import { ExternalCostResource, PersonnelResource, Resource } from "@/interfaces/resource";

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

  projects: [
    { 
      title: 'Sample Project',
      description: 'A sample project with a minimal structure',
      projectLead: <Employee> {
        name: 'Franz',
        lastName: 'Muster',
        id: '#99997',
        department: 'Project Management',
        workload: 42.5,
        possibleFunctions: <Array<EmployeeFunction>> [
          {
            name: 'Project Lead'
          }
        ]
      },
      id: 'P999', 
      approvalDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      model: <ApproachModel>{ title: 'GENERIC MODEL', phases: ['Phase 1'] },
      documents: null,
      state: EProjectState.FINISHED,
      priority: EProjectPriority.HIGH,
      progress: 100,
      phases: <Array<Phase>>[
        { 
          title: 'Phase 1',
          approvalDate: new Date(),
          startDate: new Date(),
          endDate: new Date(),
          state: EProjectState.FINISHED,
          progress: 100,
          documents: null,
          milestones: <Array<Milestone>> [
            {
              activities: ['1']
            }
          ],
          activities: <Array<Activity>> [
            {
              startDate: new Date(),
              endDate: new Date(),
              id: '1',
              documents: null,
              progress: 100,
              resources: <Array<Resource>> [
                <ExternalCostResource> {
                  costCenter: <CostCenter> {
                    title: 'Dummy Cost Center',
                    id: 'CC999',
                  },
                  actual: 20,
                  plan: 20,
                  deviation: ''
                }
              ],
              responsibility: <Employee> {
                name: 'Max',
                lastName: 'Muster',
                id: '#99999',
                department: 'SW Development',
                possibleFunctions: <Array<EmployeeFunction>> [
                  {
                    name: 'Developer'
                  }
                ],
                workload: 42.5
              },
            },
            {
              startDate: new Date(),
              endDate: new Date(),
              id: '1',
              documents: null,
              progress: 100,
              resources: <Array<Resource>> [
                <PersonnelResource> {
                  function: <EmployeeFunction> {
                    name: 'Developer'
                  },
                  assignee: <Employee> {
                    name: 'Peter',
                    lastName: 'Muster',
                    id: '#99998',
                    department: 'SW Development',
                    possibleFunctions: <Array<EmployeeFunction>> [
                      {
                        name: 'Developer'
                      }
                    ],
                    workload: 30
                  },
                  actual: 20,
                  plan: 20,
                  deviation: ''
                }
              ],
              responsibility: <Employee> {
                name: 'Max',
                lastName: 'Muster',
                id: '#99999',
                department: 'SW Development',
                possibleFunctions: <Array<EmployeeFunction>> [
                  {
                    name: 'Developer'
                  }
                ],
                workload: 42.5
              },
            },
          ],
        }
      ],
    }
  ] as Array<Project>,

  newProject: null as Partial<Project> | null,
}