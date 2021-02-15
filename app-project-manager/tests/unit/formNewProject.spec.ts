import FormNewProject from '@/views/Dashboard/FormNewProject.vue'
import { IPrimerSelectItem } from '@/interfaces/primerField';
import { mount } from '@vue/test-utils'

describe('FormNewProject.vue', () => {
  it('validates its input', async () =>
  {
    const wrapper = mount(FormNewProject)

    // Validate without input
    await expect(wrapper.vm.validateForm())
      .rejects
      .toThrow('Not valid')

    // Grab arbitrary priority, model & project lead
    const priority = wrapper.vm.priorities[0] as IPrimerSelectItem
    const model = wrapper.vm.approachModels[0] as IPrimerSelectItem
    const lead = wrapper.vm.availableProjectLeads[0] as IPrimerSelectItem

    // Fill form, invalid id
    await wrapper.findAll('input')[0].setValue('Sample Project')
    await wrapper.findAll('input')[1].setValue('P21') // illegal
    await wrapper.findAll('select')[0].setValue(priority.name) 
    await wrapper.findAll('select')[1].setValue(model.name)
    await wrapper.findAll('select')[2].setValue(lead.name)
    await wrapper.findAll('input')[2].setValue('30.12.2021')
    await wrapper.find('textarea').setValue('A sample description with more than 10 chars')

    await expect(wrapper.vm.validateForm())
      .rejects
      .toThrow('Not valid')

    // Check with a correct id
    await wrapper.findAll('input')[1].setValue('P210')

    await expect(wrapper.vm.validateForm())
      .resolves
      .toContain('successfully')

  })
});
