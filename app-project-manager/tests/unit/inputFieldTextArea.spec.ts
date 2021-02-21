import InputFieldTextArea from '@/components/InputFieldTextArea.vue'
import { mount } from '@vue/test-utils'

describe('InputFieldTextArea.vue', () => 
{
  const inputName = 'TestInput'
  const inputDescription = 'Sample description'
  const wrapper = mount(InputFieldTextArea, {
    props: {
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

  it('validates generic text', async () =>
  {
    // Valid Text
    await wrapper.find('textarea').setValue('abcdefghijklmnopqrstuvwxyz-_0123456789')
    let res: string = wrapper.vm.validateInput({ regex: 'default' })
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toEqual('abcdefghijklmnopqrstuvwxyz-_0123456789')
    
    // Invalid Text
    await wrapper.find('textarea').setValue('abcdefghijklmnopqrstuvwxyz-_0123456789....')
    res = wrapper.vm.validateInput({ regex: 'default'})
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()
  })
  
  it('handles char count boundaries', async () => 
  {
    const minChar = 5
    const maxChar = 10

    // Invalid, char count < minChar
    await wrapper.find('textarea').setValue(('a').repeat(4))
    let res: string = wrapper.vm.validateInput({ minChar, regex: 'default' })
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()

    // Valid
    await wrapper.find('textarea').setValue(('a').repeat(5))
    res = wrapper.vm.validateInput({ minChar, regex: 'default' })
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toEqual(('a').repeat(5))

    // Invalid, char count > maxChar
    await wrapper.find('textarea').setValue(('a').repeat(11))
    res = wrapper.vm.validateInput({ maxChar, regex: 'default' })
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()

    // Valid
    await wrapper.find('textarea').setValue(('a').repeat(10))
    res = wrapper.vm.validateInput({ maxChar, regex: 'default' })
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toEqual(('a').repeat(10))
  })

  it('accounts for custom regex', async () =>
  {
    const regex = /^123$/g

    // Invalid
    await wrapper.find('textarea').setValue('312')
    let res: string = wrapper.vm.validateInput({ regex })
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()
    
    // Valid
    await wrapper.find('textarea').setValue('123')
    res = wrapper.vm.validateInput({ regex })
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toEqual('123')
  })

  it('checks for duplicates', async () =>
  {
    const dupes = 'abc'.split('')

    // Invalid
    await wrapper.find('textarea').setValue('a')
    let res: string = wrapper.vm.validateInput({ duplicatesArray: dupes, regex: 'default' })
    expect(wrapper.vm.errorMessage).toContain(inputName)
    expect(res).toBeNull()
    
    // Valid
    await wrapper.find('textarea').setValue('d')
    res = wrapper.vm.validateInput({ duplicatesArray: dupes, regex: 'default' })
    expect(wrapper.vm.errorMessage).toEqual('')
    expect(res).toEqual('d')  
  })
})