import InputFieldSelect from '@/components/InputFieldSelect.vue'
import { mount } from '@vue/test-utils'

describe('InputFieldSelect.vue', () => 
{
  const inputName = 'TestInput'
  const inputDescription = 'Sample description'
  const wrapper = mount(InputFieldSelect, {
    props:{
      selectOptions: [{ name: 'Low', payload: 1 }, { name: 'Medium', payload: 2 }, { name: 'High', payload: 3 }],
      inputName,
      inputDescription
    }
  })

  it('should display its title and description', async () => 
  {
    const name = await wrapper.find('label').text()    
    expect(name).toEqual(inputName)

    const desc = await wrapper.find('span').text()
    expect(desc).toEqual(inputDescription)
  })

  it('returns the payload of the selected item', async () =>
  {
    // Placeholder Value, invalid input
    let res: number = wrapper.vm.validateInput()
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()

    // Valid
    await wrapper.find('select').setValue('Low')
    res = wrapper.vm.validateInput()
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toEqual(1)
  })
})
