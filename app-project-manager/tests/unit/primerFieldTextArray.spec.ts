import PrimerFieldArrayText from '@/components/PrimerFieldArrayText.vue'
import { mount } from '@vue/test-utils'

describe('PrimerFieldArrayText.vue', () => {
  it('validates too short / too long input', async () =>
  {
    const wrapper = mount(PrimerFieldArrayText)

    // Too short
    await wrapper.find('input').setValue('d,')
    await wrapper.find('input').trigger('keyup', { code: 'Comma' })

    expect(wrapper.vm.errorMessage).toContain('at least')

    // Too long
    await wrapper.find('input').setValue('d'.repeat(65) + ',')
    await wrapper.find('input').trigger('keyup', { code: 'Comma' })

    expect(wrapper.vm.errorMessage).toContain('not exceed')
  }),

  it('validates amount of items', async () =>
  {
    const wrapper = mount(PrimerFieldArrayText)

    // Valid amount
    await wrapper.find('input').setValue('phase 1,')
    await wrapper.find('input').trigger('keyup', { code: 'Comma' })

    wrapper.vm.validateInput(1)
    expect(wrapper.vm.errorMessage).toEqual('')

    // Invalid amount
    wrapper.vm.validateInput(2)
    expect(wrapper.vm.errorMessage).toContain('at least')
  }),

  it('can change the order of its items and delete items', async () =>
  {
    const wrapper = mount(PrimerFieldArrayText)

    await wrapper.find('input').setValue('Phase 1,')
    await wrapper.find('input').trigger('keyup', { code: 'Comma' })
    await wrapper.find('input').setValue('Phase 2,')
    await wrapper.find('input').trigger('keyup', { code: 'Comma' })

    // Initial order
    wrapper.vm.validateInput(1)
    expect(wrapper.vm.items).toEqual(['Phase 1', 'Phase 2'])

    // Swap 1 & 2
    await wrapper.findAll('button')[3].trigger('click')
    wrapper.vm.validateInput(1)
    expect(wrapper.vm.items).toEqual(['Phase 2', 'Phase 1'])

    // Delete 1st item (Phase 2)
    await wrapper.findAll('button')[2].trigger('click')
    wrapper.vm.validateInput(1)
    expect(wrapper.vm.items).toEqual(['Phase 1'])
  })
});
