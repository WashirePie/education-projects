import PrimerFieldSelectMultiple from '@/components/PrimerFieldSelectMultiple.vue'
import { mount } from '@vue/test-utils'

describe('PrimerFieldSelectMultiple.vue', () => {
  it('returns the payload of the selected item', async () =>
  {
    const wrapper = mount(PrimerFieldSelectMultiple, {
      props:{
        inputSource: [{ name: 'Option 1', note: 'Available', state: false, payload: 1 }, { name: 'Option 2', note: 'Available', state: false, payload: 1 }]
      }
    })

    // Validate minimum amount of selected items
    let res = wrapper.vm.validateInput(1)
    expect(wrapper.vm.errorMessage).toContain('at least')
    expect(res).toBeNull()

    await wrapper.findAll('input')[0].setValue(true)
    await wrapper.findAll('input')[1].setValue(true)
    res = wrapper.vm.validateInput(2)
    expect(wrapper.vm.errorMessage).toContain('')
    expect(res).toEqual([1, 1])
  })
});
