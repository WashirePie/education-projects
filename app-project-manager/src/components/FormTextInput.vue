<template>
  <it-input
    v-model="inputValue"
    :status="inputState"
    :message="inputMessage"
    :label-top="inputLabel"
    :placeholder="inputName"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { genericTextValidation, customTextValidation } from '@/helpers/validators'

export default defineComponent({
  props: {
    inputName: {
      type: String,
      default: 'Generic Text Input'
    },
    inputDesc: {
      type: String,
      default: ''
    },
    hideLabel: {
      type: Boolean,
      default: false
    }
  },
  setup (props)
  {
    const inputLabel = props.hideLabel ? undefined : props.inputName + props.inputDesc
    const inputState = ref<undefined | string>(undefined)
    const inputMessage = ref('')
    const inputValue = ref('')

    // Reset input styles
    watch(inputValue, () =>
    {
      inputState.value = undefined
      inputMessage.value = ''
    })

    const validateInput = (minChar = 2, maxChar = 60) =>
    {
      const validation = genericTextValidation(props.inputName, inputValue.value, minChar, maxChar)
      if (!validation)
      {
        inputState.value = 'success'
        return inputValue.value
      }
      else
      {
        inputState.value = 'danger'
        inputMessage.value = validation
        return null
      }
    }

    const validateInputCustom = (regex: RegExp) =>
    {
      const validation = customTextValidation(props.inputName, inputValue.value, regex)
      if (!validation)
      {
        inputState.value = 'success'
        return inputValue.value
      }
      else
      {
        inputState.value = 'danger'
        inputMessage.value = validation
        return null
      }
    }
    return { inputLabel, inputState, inputMessage, inputValue, validateInput, validateInputCustom }
  }
})
</script>

<style>

</style>
