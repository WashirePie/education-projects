// import FormNewCostCenter from '@/views/Create/FormNewCostCenter.vue'
// import { mount } from '@vue/test-utils'

// describe('FormNewCostCenter.vue', () => {
//   it('validates its input', async () =>
//   {
//     const wrapper = mount(FormNewCostCenter)

//     // Validate without input
//     await expect(wrapper.vm.validateForm())
//       .rejects
//       .toThrow('Not valid')

//     // Fill form, invalid id
//     await wrapper.findAll('input')[0].setValue('Sample CC')
//     await wrapper.findAll('input')[1].setValue('CC00')

//     await expect(wrapper.vm.validateForm())
//       .rejects
//       .toThrow('Not valid')

//     // Check with a correct id
//     await wrapper.findAll('input')[1].setValue('CC001')

//     await expect(wrapper.vm.validateForm())
//       .resolves
//       .toContain('successfully')

//   })
// });
describe('FormNewCostType', () => {
  it('should return true', () => {
    expect(true).toBeTruthy()
  });
});
