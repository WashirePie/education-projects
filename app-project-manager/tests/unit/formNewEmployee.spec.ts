import FormNewEmployee from '@/views/Create/FormNewEmployee.vue'
import { mount } from '@vue/test-utils'

describe('FormNewEmployee.vue', () => {
  it('validates its input', async () =>
  {
    const wrapper = mount(FormNewEmployee)

    // Validate without input
    await expect(wrapper.vm.validateForm())
      .rejects
      .toThrow('Not valid')

    // Fill form, invalid id
    await wrapper.findAll('input')[0].setValue('John')
    await wrapper.findAll('input')[1].setValue('Doe')
    await wrapper.findAll('input')[2].setValue('RnD')
    await wrapper.findAll('input')[3].setValue('#5432') // illegal
    await wrapper.findAll('input')[4].setValue('30.25')
    await wrapper.findAll('input')[5].setValue(true)

    await expect(wrapper.vm.validateForm())
      .rejects
      .toThrow('Not valid')

    // Check with a correct id
    await wrapper.findAll('input')[3].setValue('#54321')

    await expect(wrapper.vm.validateForm())
      .resolves
      .toContain('successfully')

  })
});
