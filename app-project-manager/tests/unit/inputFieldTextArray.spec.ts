import InputFieldOrderableText from '@/components/InputFieldOrderableText.vue'
import { mount } from '@vue/test-utils'

describe('InputFieldOrderableText.vue', () => {
  const inputName = 'TestInput'
  const inputDescription = 'Sample description'
  const wrapper = mount(InputFieldOrderableText, {
    props: {
      inputName,
      inputDescription
    }
  })

  it('should display its title and description', async () => {
    const name = await wrapper.find('label').text()
    expect(name).toEqual(inputName)

    const desc = await wrapper.find('span').text()
    expect(desc).toEqual(inputDescription)
  })

  it('validates too short / too long input', async () => {
    // Too short
    await wrapper.find('input').setValue('d,')
    await wrapper.find('input').trigger('keyup', { code: 'Comma' })

    expect(wrapper.vm.errorMessage).toContain('at least')

    // Too long
    await wrapper.find('input').setValue('d'.repeat(65) + ',')
    await wrapper.find('input').trigger('keyup', { code: 'Comma' })

    expect(wrapper.vm.errorMessage).toContain('not exceed')
  })

  it('validates amount of items', async () => {
    // Valid amount
    await wrapper.find('input').setValue('Phase 1,')
    await wrapper.find('input').trigger('keyup', { code: 'Comma' })

    wrapper.vm.validateInput(1)
    expect(wrapper.vm.errorMessage).toEqual('')

    // Invalid amount
    wrapper.vm.validateInput(2)
    expect(wrapper.vm.errorMessage).toContain(inputName)
  })

  it('can change the order of its items and delete items', async () => {
    await wrapper.find('input').setValue('Phase 3,')
    await wrapper.find('input').trigger('keyup', { code: 'Comma' })
    await wrapper.find('input').setValue('Phase 2,')
    await wrapper.find('input').trigger('keyup', { code: 'Comma' })

    // Initial order
    wrapper.vm.validateInput(1)
    expect(wrapper.vm.items).toEqual(['Phase 1', 'Phase 3', 'Phase 2'])

    // Swap 3 & 2
    await wrapper.findAll('button')[4].trigger('click')
    wrapper.vm.validateInput(1)
    expect(wrapper.vm.items).toEqual(['Phase 1', 'Phase 2', 'Phase 3'])

    // Delete 3rd item (Phase 3)
    await wrapper.findAll('button')[8].trigger('click')
    wrapper.vm.validateInput(1)
    expect(wrapper.vm.items).toEqual(['Phase 1', 'Phase 2'])
  })
})
