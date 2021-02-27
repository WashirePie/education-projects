import { Activity } from '@/classes/activity'
import { ApproachModel } from '@/classes/approachModel'
import { CostType } from '@/classes/costType'
import { DocumentRef } from '@/classes/document'
import { EEmployeeFunctions, Employee, IEmployeeFunction } from '@/classes/employee'
import { EMilestoneState, Milestone } from '@/classes/milestone'
import { Phase } from '@/classes/phase'
import { EProjectPriority, EProjectState, Project } from '@/classes/project'
import { ExternalCostResource, PersonnelResource } from '@/classes/resource'

let approachModel: ApproachModel | null = null
let project: Project | null = null
let phase: Phase | null = null
let milestone: Milestone | null = null
let employee: Employee | null = null
let activity: Activity | null = null
let personnelResource: PersonnelResource | null = null
let externalCostResource: ExternalCostResource | null = null

describe('requirements according to the specification book', () => 
{
  it('should cover FA0, FA1', () => 
  {
    const phases = ['Phase 1', 'Phase 2']
    approachModel = new ApproachModel('Sample AM', phases)
    expect(approachModel).toBeDefined() // FA0, FA0.3
    expect(approachModel).toHaveProperty('phases', phases) // FA0.1
    
    const generatedPhases = approachModel.scaffold()
    expect(generatedPhases.every(p => p.state == EProjectState.PLANNING)).toBeTruthy() // FA0.2

    // FA1 is covered trough the builtin garbage collector
  })

  it('should cover FA2, FA3, FA4', () => 
  {
    const title = 'Sample Project'
    const id = 'P123'
    const desc = 'Description'
    const startDate = new Date()
    const priority = EProjectPriority.HIGH
    const projectLead = new Employee('Sam', 'Wise', 'Dep', '#12345', 30, [{ name: EEmployeeFunctions.Designer}])

    project = new Project(title, id, approachModel!, desc, startDate, priority, projectLead )
    expect(project).toBeDefined() // FA2

    expect(project).toHaveProperty('state', EProjectState.PLANNING) // FA3

    expect(project).toHaveProperty('startDate', startDate) // FA4
    expect(project).toHaveProperty('endDate', startDate) // FA4
    expect(project).toHaveProperty('model', approachModel) // FA4
    expect(project).toHaveProperty('description', desc) // FA4
    expect(project).toHaveProperty('priority', priority) // FA4
    expect(project).toHaveProperty('projectLead', projectLead) // FA4
    expect(project).toHaveProperty('progress', 0) // FA4
    expect(project).toHaveProperty('documents', []) // FA4
    expect(project).toHaveProperty('approvalDate', null) // FA4

    // TODO: Show that Project end date is defined by its phases end date
  })

  it('should cover FA5', () => 
  {
    const title = 'Sample Phase'
    
    phase = new Phase(title)
    expect(phase).toBeDefined() // FA5

    expect(phase).toHaveProperty('phaseMilestone') // FA5
    expect(phase.phaseMilestone).toBeInstanceOf(Milestone) // FA5

    expect(phase).toHaveProperty('state', EProjectState.PLANNING) // FA5

    expect(phase).toHaveProperty('startDate') // FA5
    expect(phase.startDate).toBeInstanceOf(Date)

    expect(phase).toHaveProperty('endDate') // FA5
    expect(phase.endDate).toBeInstanceOf(Date)

    expect(phase).toHaveProperty('progress', 0) // FA5
    expect(phase).toHaveProperty('documents', []) // FA5
    expect(phase).toHaveProperty('approvalDate', null) // FA5

    expect(phase).toHaveProperty('milestones', []) // FA5
  })

  it('should cover FA6', () =>
  {
    const name = 'Sample Milestone'
    const watchedActivities = ['1']
    
    milestone = new Milestone(name, watchedActivities)
    expect(milestone).toBeDefined() // FA6

    expect(milestone).toHaveProperty('activities', watchedActivities) // FA6

    phase?.addActivity(
      'Dummy Activity', 
      new Date(), 
      new Date(), 
      [ new ExternalCostResource('', 1, new CostType('','')) ], 
      new Employee('Sam', 'Wise', 'Dep', '#12345', 30, [{ name: EEmployeeFunctions.Designer}])
    )

    const id = phase?.activities[0].id

    expect(phase?.phaseMilestone.activities).toEqual([id]) // FA6.1
  })

  it('should cover FA7, FA8, FA9', () =>
  {
    const title = 'Sample Activity'
    const id = '123'
    const startDate = new Date()
    const endDate = new Date()
    const responsible = new Employee('Sam', 'Wise', 'Dep', '#12345', 30, [{ name: EEmployeeFunctions.Designer}])

    activity = new Activity(id, title, startDate, endDate, [], responsible)
    expect(activity).toBeDefined() // FA7, FA8

    expect(activity).toHaveProperty('startDate', startDate) // FA9
    expect(activity).toHaveProperty('endDate', endDate) // FA0
    expect(activity).toHaveProperty('progress', 0) // FA9
    expect(activity).toHaveProperty('title', title) // FA9 (Called 'Activity' in the spec book)
    expect(activity).toHaveProperty('responsibility', responsible) // FA9

    expect(activity.resources.push(new PersonnelResource('Dummy Rsc', 10, EEmployeeFunctions.Designer, responsible))).toBeTruthy() // FA9
    expect(activity.resources.push(new ExternalCostResource('Dummy Rsc', 10, new CostType('Dummy CT', 'CT42')))).toBeTruthy() // FA9
  })

  it('should cover FA10, FA11, FA12', () =>
  {
    const name = 'Max'
    const lastName = 'Muster'
    const dep = 'SW-Development'
    const id = '#12345'
    const workload = 40
    const funcs: Array<IEmployeeFunction> = [{ name: EEmployeeFunctions.Administrator }]

    employee = new Employee(name, lastName, dep, id, workload, funcs)
    expect(employee).toBeDefined() // FA10, FA11

    expect(employee).toHaveProperty('name', name) // FA12
    expect(employee).toHaveProperty('lastName', lastName) // FA12
    expect(employee).toHaveProperty('department', dep) // FA12
    expect(employee).toHaveProperty('id', id) // FA12
    expect(employee).toHaveProperty('workload', workload) // FA12
    expect(employee).toHaveProperty('possibleFunctions', funcs) // FA12
  })

  it('should cover FA13, FA14, FA15', () =>
  {
    const title = 'Sample Personnel Resource'
    const plan = 20
    const func = EEmployeeFunctions.Designer
    const assignee = new Employee('Sam', 'Wise', 'Dep', '#12345', 30, [{ name: EEmployeeFunctions.Designer}])
    const illegalAssignee = new Employee('Seth', 'Wise', 'Dep', '#12346', 30, [{ name: EEmployeeFunctions.Administrator }])

    // Personnel resources can only be assigned to employees who are capable of the function
    expect(() => { let a = new PersonnelResource(title, plan, func, illegalAssignee) }).toThrowError()
    
    personnelResource = new PersonnelResource(title, plan, func, assignee)
    expect(personnelResource).toBeDefined() // FA13, FA14

    expect(personnelResource).toHaveProperty('plan', plan) // FA15
    expect(personnelResource).toHaveProperty('actual', 0) // FA15
    expect(personnelResource).toHaveProperty('function', func) // FA15
    expect(personnelResource).toHaveProperty('deviation', '') // FA15
    expect(personnelResource).toHaveProperty('assignee', assignee) // FA15
  })

  it('should cover FA16, FA17, FA18', () =>
  {
    const title = 'Sample External Cost Resource'
    const plan = 20
    const costType = new CostType('Dummy Cost Type', 'CT123')

    externalCostResource = new ExternalCostResource(title, plan, costType)
    expect(externalCostResource).toBeDefined() // FA16, FA17

    expect(externalCostResource).toHaveProperty('costType', costType) // FA18
    expect(externalCostResource).toHaveProperty('plan', plan) // FA18
    expect(externalCostResource).toHaveProperty('deviation', '') // FA18
  })

  it('should cover FA19, FA20', () =>
  {
    // Not all phases are planned
    expect(() => project?.plan()).toThrowError() // FA19

    project?.phases[0].addActivity('Activity 0.0', new Date(), new Date(), [new ExternalCostResource('Dummy Rsc', 10, new CostType('Dummy CT', 'CT42'))], employee!, [])
    project?.phases[1].addActivity('Activity 1.0', new Date(), new Date(), [new ExternalCostResource('Dummy Rsc', 10, new CostType('Dummy CT', 'CT42'))], employee!, [])

    project?.phases[0].addMilestone('Milestone 0', ['0'])
    project?.phases[1].addMilestone('Milestone 1', ['0'])
    
    project?.phases[0].plan(project)
    project?.phases[1].plan(project)

    expect(project?.phases.every(p => p.isPlanned)).toBeTruthy() // FA19
    
    project?.plan()

    expect(project?.isAwaitingApproval).toBeTruthy() // FA20
  })

  it('should cover FA21', () =>
  {
    project?.documents.push(new DocumentRef('Sample', 'C:/File.md', '.md'))
    project?.phases[0].documents.push(new DocumentRef('Sample', 'C:/File.md', '.md'))
    project?.phases[0].activities[0].documents.push(new DocumentRef('Sample', 'C:/File.md', '.md'))

    project!.phases[0].activities[0].resources[0].actual = 11 // FA21
    project!.phases[0].activities[0].resources[0].deviation = 'Sample Deviation explanation' // FA21
  })

  it('sholud cover FA22, FA23, FA24', () =>
  {
    project!.phases[0].activities[0].progress = 100;

    expect(project!.phases[0].progress).toEqual(100) // FA23
    expect(project!.progress).toEqual(50) // FA22
  })

  it('should cover FA25, 26', () =>
  {
    // Phase 0's milestone should be evaluatable because it's activities progress was set to 100%
    // Wherease Phase 1's milestone should not be evaluatable
    expect(project!.phases[0].getMilestoneEvaluatable(project!.phases[0].milestones[0])).toBeTruthy() // FA25
    expect(project!.phases[1].getMilestoneEvaluatable(project!.phases[1].milestones[0])).toBeFalsy() // FA25

    project!.phases[1].activities[0].resources[0].actual = 11 // plan >= actual (Actual was set to 10)
    expect(project!.phases[1].getMilestoneEvaluatable(project!.phases[1].milestones[0])).toBeTruthy() // FA26
  })

  it('should cover FA27, FA28, FA29', () =>
  {
    project!.phases[0].setMilestoneState(project!.phases[0].milestones[0], EMilestoneState.continued)
    expect(project!.phases[0].milestones[0].state).toEqual(EMilestoneState.continued) // FA27

    project!.phases[1].setMilestoneState(project!.phases[1].milestones[0], EMilestoneState.reworked)
    expect(project!.phases[1].milestones[0].state).toEqual(EMilestoneState.reworked) // FA27
    expect(project!.phases[1].activities[0].resources[0].plan).toEqual(12.1)

    expect(project!.phases[0].isFinished).toBeTruthy() // FA28
    expect(project!.phases[1].isFinished).toBeFalsy() // FA28

    project?.cancel()
    expect(project!.state).toEqual(EProjectState.CANCELLED) // FA29
  })
})