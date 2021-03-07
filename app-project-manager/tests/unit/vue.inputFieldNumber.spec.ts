import InputFieldNumber from '@/components/InputFieldNumber.vue'
import { mount } from '@vue/test-utils'

describe('InputFieldDate.vue', () => {
  const inputName = 'TestInput'
  const inputDescription = 'Sample description'
  const wrapper = mount(InputFieldNumber, {
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

  it('validates numbers', async () => {
    // Valid Number
    await wrapper.find('input').setValue('2000')
    let res: number = wrapper.vm.validateInput({})
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toEqual(2000)

    // Invalid Number
    await wrapper.find('input').setValue('abcd')
    res = wrapper.vm.validateInput({})
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toBeNaN()
  })

  it('handles boundaries', async () => {
    const number = 42
    const biggerNumber = number + 1
    const smallerNumber = number - 1

    // Invalid, number < min
    await wrapper.find('input').setValue(number.toString())
    let res: number = wrapper.vm.validateInput({ min: biggerNumber })
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()

    // Valid
    await wrapper.find('input').setValue(number.toString())
    res = wrapper.vm.validateInput({ min: smallerNumber })
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toEqual(number)

    // Invalid, number > max
    await wrapper.find('input').setValue(number.toString())
    res = wrapper.vm.validateInput({ max: smallerNumber })
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()

    // Valid
    await wrapper.find('input').setValue(number.toString())
    res = wrapper.vm.validateInput({ max: biggerNumber })
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toEqual(number)
  })
})
