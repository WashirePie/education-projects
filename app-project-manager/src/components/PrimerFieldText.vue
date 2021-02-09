<template>

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

  <div class="form-group-body">
    <input
      :class="`form-control ${darkMode ? 'input-dark' : ''} ${errorMessage ? 'border-red' : ''}`"
      :id="inputName"
      type="text"
      v-model="inputValue"
      v-bind:placeholder="placeHolder"
    />

    <p
      class="note text-red"
      v-if="errorMessage"
    >{{ errorMessage }}</p>
  </div>

</template>

<script lang="ts">
import { customTextValidation, genericTextValidation } from '@/helpers/validators'
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  props: {
    inputName: {
      type: String,
      default: 'Generic Text Input'
    },
    inputDescription: {
      type: String,
      default: ''
    },
    darkMode: {
      type: Boolean,
      default: false
    },
    placeHolder: {
      type: String,
      default: 'Placeholder'
    }
  },
  setup(props)
  {
    const inputValue = ref<string>('')
    const errorMessage = ref<string>('')

    // Reset Error message when typing continues
    watch(inputValue, () => errorMessage.value = '')

    const validateInput = (minChar = 2, maxChar = 60) =>
    {
      const validation = genericTextValidation(props.inputName, inputValue.value, minChar, maxChar)
      if (!validation)
      {
        errorMessage.value = ''
        return inputValue.value
      }
      else
      {
        errorMessage.value = validation
        return null
      }
    }

    const validateInputCustom = (regex: RegExp) =>
    {
      const validation = customTextValidation(props.inputName, inputValue.value, regex)
      if (!validation)
      {
        errorMessage.value = ''
        return inputValue.value
      }
      else
      {
        errorMessage.value = validation
        return null
      }
    }

    return { 
      inputValue, 
      errorMessage, 
      validateInput, 
      validateInputCustom 
    }
  }
})
</script>

<style>

</style>
