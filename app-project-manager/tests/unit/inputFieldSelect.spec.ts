import PrimerFieldSelect from '@/components/PrimerFieldSelect.vue'
import { mount } from '@vue/test-utils'

describe('PrimerFieldSelect.vue', () => {
  it('returns the payload of the selected item', async () =>
  {
    const wrapper = mount(PrimerFieldSelect, {
      props:{
        selectOptions: [{ name: 'Low', payload: 1 }, { name: 'Medium', payload: 2 }, { name: 'High', payload: 3 }]
      }
    })

    // Placeholder value
    wrapper.vm.validateInput()
    expect(wrapper.vm.errorMessage).toContain('must specify')

    await wrapper.find('select').setValue('Low')
    expect(wrapper.vm.errorMessage).toEqual('')

    // Validate return value
    const res = wrapper.vm.validateInput()
    expect(res).toEqual(1)
  })
});
