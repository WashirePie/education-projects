<template>
  <!-- Label & description -->
  <div class="form-group">
    <div class="form-group-header">
      <label
        :for="inputName"
      >{{ inputName }}</label>
    </div>
    <span
      class="text-small text-gray"
      v-if="inputDescription"
    >{{ inputDescription }}</span>
  </div>

  <!-- Input field -->
  <div class="form-group-body">
    <input
      :class="`form-control ${errorMessage ? 'border-red' : ''}`"
      :id="inputName"
      type="text"
      v-model="inputValue"
      :placeholder="placeHolder"
    />

    <p
      class="note text-red"
      v-if="errorMessage"
    >{{ errorMessage }}</p>
  </div>

</template>

<script lang="ts">
import { EValidationTypes, useValidation, ValidationParams, ValidationReturns } from '@/helpers/validators'
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  name: 'InputFieldText',
  props: {
    inputName: {
      type: String,
      default: 'Generic Text Input'
    },
    inputDescription: {
      type: String,
      default: ''
    },
    placeHolder: {
      type: String,
      default: 'Placeholder'
    },
  },
  setup(props)
  {
    const inputValue   = ref<string>('')
    const errorMessage = ref<string>('')

    const validate = useValidation()

    // Reset Error message when typing continues
    watch(inputValue, () => errorMessage.value = '')

    const validateInput = (params: ValidationParams[EValidationTypes.textValidation]): ValidationReturns[EValidationTypes.textValidation]['payload'] =>
    {
      let res = validate(EValidationTypes.textValidation, {source: inputValue.value, sourceName: props.inputName}, params) as ValidationReturns[EValidationTypes.textValidation]
      errorMessage.value = res.responseMessage
      return res.payload
    }

    return { 
      inputValue, 
      errorMessage, 
      validateInput
    }
  }
})
</script>