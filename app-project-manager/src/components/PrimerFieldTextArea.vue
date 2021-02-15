<template>
  <!-- Label & description -->
  <div class="form-group">
    <div class="form-group-header">
      <label
        :class="`${darkMode ? 'text-white' : ''}`"
        :for="inputName"
      >{{ inputName }}</label>
    </div>
    <span
      :class="`text-small ${darkMode ? 'text-white' : 'text-gray'}`"
      v-if="inputDescription"
    >{{ inputDescription }}</span>
  </div>

  <!-- Input field -->
  <div class="form-group-body">
    <textarea
      v-model="inputValue"
      :class="`form-control input-block ${darkMode ? 'input-dark' : ''} ${errorMessage ? 'border-red' : ''}`"
      :id="inputName"
    ></textarea>

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
  props: {
    inputName: {
      type: String,
      default: 'Generic Textarea Input'
    },
    inputDescription: {
      type: String,
      default: ''
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  setup(props)
  {
    const validate = useValidation()

    const inputValue   = ref<string>('')
    const errorMessage = ref<string>('')

    // Reset Error message when typing continues
    watch(inputValue, () => errorMessage.value = '')

    const validateInput = <K extends EValidationTypes, P extends ValidationParams[K], R extends ValidationReturns[K]>(type: K, params: P): R['payload'] =>
    {
      const res = validate(type, {source: inputValue.value, sourceName: props.inputName}, params) as R
      errorMessage.value = res.responseMessage
      return res.payload
    }

    return { 
      validateInput,
      errorMessage, 
      inputValue 
    }
  }
})
</script>
