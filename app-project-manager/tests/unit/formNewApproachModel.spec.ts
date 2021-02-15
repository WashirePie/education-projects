import FormNewApproachModel from '@/views/Create/FormNewApproachModel.vue'
import { mount } from '@vue/test-utils'

describe('FormNewApproachModel.vue', () => {
  it('validates its input', async () =>
  {
    const wrapper = mount(FormNewApproachModel)

    // Validate without input
    await expect(wrapper.vm.validateForm())
      .rejects
      .toThrow('Not valid')

    // Fill form
    await wrapper.findAll('input')[0].setValue('Sample Model')
    await wrapper.findAll('input')[1].setValue('Phase 1,')
    await wrapper.findAll('input')[1].trigger('keyup', { code: 'Comma' } )

    await expect(wrapper.vm.validateForm())
      .resolves
      .toContain('successfully')
  })
});
