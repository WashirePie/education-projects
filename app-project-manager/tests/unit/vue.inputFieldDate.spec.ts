import InputFieldDate from '@/components/InputFieldDate.vue'
import { mount } from '@vue/test-utils'

describe('InputFieldDate.vue', () => {
  const inputName = 'TestInput'
  const inputDescription = 'Sample description'
  const wrapper = mount(InputFieldDate, {
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

  it('validates dates in the CH locale format', async () => {
    // Valid Date
    await wrapper.find('input').setValue('2021-02-17')
    let res: Date = wrapper.vm.validateInput({})
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res.getDate()).toEqual(17)
    expect(res.getMonth()).toEqual(1)
    expect(res.getFullYear()).toEqual(2021)

    // Invalid Date
    await wrapper.find('input').setValue('2021-20-17')
    res = wrapper.vm.validateInput({})
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()
  })

  it('handles date boundaries', async () => {
    const toISODate = (d: Date): string => {
      let isoDate = d.toISOString()
      return isoDate.substring(0, isoDate.split('').indexOf('T'))
    }

    const date = new Date()

    const pastDate = new Date()
    pastDate.setDate(date.getDate() - 2)

    const futureDate = new Date()
    futureDate.setDate(date.getDate() + 1)

    // Invalid, date < minDate
    await wrapper.find('input').setValue(toISODate(date))
    let res: Date = wrapper.vm.validateInput({ minDate: futureDate })
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()

    // Valid
    await wrapper.find('input').setValue(toISODate(date))
    res = wrapper.vm.validateInput({ minDate: pastDate })
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res.getDate()).toBeLessThanOrEqual(date.getDate())
    expect(res.getDate()).toBeGreaterThanOrEqual(date.getDate() - 1)
    expect(res.getMonth()).toEqual(date.getMonth())
    expect(res.getFullYear()).toEqual(date.getFullYear())

    // Invalid, date > maxDate
    await wrapper.find('input').setValue(toISODate(date))
    res = wrapper.vm.validateInput({ maxDate: pastDate })
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()

    // Valid
    await wrapper.find('input').setValue(toISODate(date))
    res = wrapper.vm.validateInput({ maxDate: futureDate })
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res.getDate()).toBeLessThanOrEqual(date.getDate())
    expect(res.getDate()).toBeGreaterThanOrEqual(date.getDate() - 1)
    expect(res.getMonth()).toEqual(date.getMonth())
    expect(res.getFullYear()).toEqual(date.getFullYear())
  })
})
