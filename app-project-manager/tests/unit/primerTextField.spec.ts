import { mount } from '@vue/test-utils'
import PrimerFieldText from '@/components/PrimerFieldText.vue'

describe('PrimerFieldText.vue', () => {
  it('validates too short / too long input', async () =>
  {
    const wrapper = mount(PrimerFieldText)

    await wrapper.find('input').setValue('d')
    wrapper.vm.validateInput(2, 10)

    expect(wrapper.vm.errorMessage).toContain('at least')

    await wrapper.find('input').setValue('d'.repeat(11))
    wrapper.vm.validateInput(2, 10)

    expect(wrapper.vm.errorMessage).toContain('not exceed')
  })
});
