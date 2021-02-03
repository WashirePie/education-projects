<template>
  <it-number-input
    v-model="inputValue"
    :min="inputOptions.min"
    :max="inputOptions.max"
    :step="inputOptions.step"
    :label-top="inputLabel"
    :resize-on-write="true"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    inputName: {
      type: String,
      default: 'Generic Slider Input'
    },
    inputDesc: {
      type: String,
      default: ''
    },
    inputOptions: {
      type: Object,
      default: () => ({ min: 0, max: 100, step: 1, init: 0 })
    },
    hideLabel: {
      type: Boolean,
      default: false
    }
  },
  setup(props)
  {
    const inputLabel = props.hideLabel ? undefined : props.inputName + props.inputDesc
    const inputValue = ref(props.inputOptions.init)

    const validateInput = () => inputValue.value

    return { inputLabel, inputValue, validateInput }
  }
})
</script>

<style>

</style>
