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
import { genericTextValidation } from '@/helpers/validators'
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
    const inputValue = ref<string>('')
    const errorMessage = ref<string>('')

    // Reset Error message when typing continues
    watch(inputValue, () => errorMessage.value = '')

    const validateInput = (minChar = 10, maxChar = 500) =>
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

    return { validateInput, errorMessage, inputValue }
  }
})
</script>

<style>

</style>
