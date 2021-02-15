import PrimerFieldText from '@/components/PrimerFieldText.vue'
import { mount } from '@vue/test-utils'
import { EValidationTypes } from '@/helpers/validators';

describe('PrimerFieldText.vue', () => {
  it('validates too short / too long input', async () =>
  {
    const wrapper = mount(PrimerFieldText)

    // Too short
    await wrapper.find('input').setValue('d')
    wrapper.vm.validateInput(EValidationTypes.textValidation, { minChar: 2, maxChar: 10})

    expect(wrapper.vm.errorMessage).toContain('at least')

    // Too long
    await wrapper.find('input').setValue('d'.repeat(11))
    wrapper.vm.validateInput(EValidationTypes.textValidation, { minChar: 2, maxChar: 10})

    expect(wrapper.vm.errorMessage).toContain('not exceed')
  }),

  it('validates dates in the CH locale format', async () =>
  {
    const wrapper = mount(PrimerFieldText)

    // Valid Date
    await wrapper.find('input').setValue('30.12.2000')
    wrapper.vm.validateInput(EValidationTypes.textDateValidation, null)

    expect(wrapper.vm.errorMessage).toEqual('')

    // Invalid Date
    await wrapper.find('input').setValue('12.30.2000')
    wrapper.vm.validateInput(EValidationTypes.textDateValidation, null)

    expect(wrapper.vm.errorMessage).toContain('valid') // as in 'not valid'
  })
});
