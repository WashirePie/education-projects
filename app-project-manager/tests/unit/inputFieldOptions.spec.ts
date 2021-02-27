import InputFieldOptions from '@/components/InputFieldOptions.vue'
import { mount } from '@vue/test-utils'

describe('InputFieldOptions.vue', () => {
  const inputName = 'TestInput'
  const inputDescription = 'Sample description'
  const wrapper = mount(InputFieldOptions, {
    props: {
      inputSource: [{ name: 'Option 1', note: 'Available', state: false, payload: 1 }, { name: 'Option 2', note: 'Available', state: false, payload: 1 }],
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

  it('returns the payload of the selected item', async () => {
    // Validate minimum amount of selected items
    let res: number = wrapper.vm.validateInput(1)
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()

    await wrapper.findAll('input')[0].setValue(true)
    await wrapper.findAll('input')[1].setValue(true)
    res = wrapper.vm.validateInput(2)
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toEqual([1, 1])
  })
})
