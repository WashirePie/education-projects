import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { EEmployeeFunctions, Employee } from "@/classes/employee";
import { EProjectPriority, EProjectState, Project } from "@/classes/project";
import { useStore } from "@/store";
import { ActionTypes } from "@/store/actions";

const store = useStore()

describe('store', () => {
  const model = new ApproachModel('Sample Model', ['Phase 1', 'Phase 2'])
  it('should manage the ApproachModel state', async () => {

    await expect(store.dispatch(ActionTypes.storeApproachModel, model)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.storeApproachModel, model)).rejects.toThrowError('already')

    await expect(store.dispatch(ActionTypes.deleteApproachModel, model)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.deleteApproachModel, model)).rejects.toThrowError('exists')
  });

  const costType = new CostType('Sample CostType', 'CT123')
  it('should manage the CostType state', async () => {

    await expect(store.dispatch(ActionTypes.storeCostType, costType)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.storeCostType, costType)).rejects.toThrowError('already')

    await expect(store.dispatch(ActionTypes.deleteCostType, costType)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.deleteCostType, costType)).rejects.toThrowError('exists')
  });

  const employee = new Employee('Max', 'Muster', 'Dep', '#12345', 45, [EEmployeeFunctions.Administrator])
  it('should manage the Employee state', async () => {

    await expect(store.dispatch(ActionTypes.storeEmployee, employee)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.storeEmployee, employee)).rejects.toThrowError('already')

    await expect(store.dispatch(ActionTypes.deleteEmployee, employee)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.deleteEmployee, employee)).rejects.toThrowError('exists')
  });

  const project = new Project('Sample Project', 'P123', model, 'desc', new Date, EProjectPriority.ABOVE_AVERAGE, employee)
  it('should manage the Project state', async () => {
    await expect(store.dispatch(ActionTypes.storeProject, project)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.storeProject, project)).rejects.toThrowError('already')

    await expect(store.dispatch(ActionTypes.deleteProject, project)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.deleteProject, project)).rejects.toThrowError('exists')
  });

  it('should manage the ProjectToBePlanned state', async () => {
    await expect(store.dispatch(ActionTypes.setProjectToBePlanned, project)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.setProjectToBePlanned, project)).rejects.toThrowError('already')

    await expect(store.dispatch(ActionTypes.setProjectToBePlanned, null)).resolves.toContain('successfully')

    await expect(store.dispatch(ActionTypes.setProjectToBePlanned, null)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.storeProject, project)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.setProjectToBePlanned, project)).rejects.toThrowError('exists')
  });

  it('should manage the ProjectToBeManaged state', async () => {
    await expect(store.dispatch(ActionTypes.setProjectToBeManaged, project)).resolves.toContain('successfully')
    await expect(store.dispatch(ActionTypes.setProjectToBeManaged, project)).rejects.toThrowError('already')
  });

  it('should manage getters', async () => {
    await expect(store.dispatch(ActionTypes.storeEmployee, employee)).resolves.toContain('successfully')

    expect(store.getters.availableProjectLeads).toBeDefined()
    expect(store.getters.sortedProjects).toBeDefined()
    expect(store.getters.waitingProjectsCount).toEqual(1)
  });
});