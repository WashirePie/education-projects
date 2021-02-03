<template>
  <it-select
    v-model="selectValue"
    class="pm-input-select"
    :options="selectOptions"
    :index="displayProperty"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    inputName: {
      type: String,
      default: 'Generic Select Input'
    },
    selectOptions: {
      type: Array,
      default: () => ([{ index: 'Low' }, { index: 'Medium' }, { index: 'High' }])
    },
    displayProperty: {
      type: String,
      default: 'index'
    }
  },
  setup (props)
  {
    let initialValue = props.selectOptions[0] as Record<string, any>

    console.log(props.inputName, initialValue)
    initialValue = initialValue[props.displayProperty]
    const selectValue = ref(initialValue)

    const validateInput = () => selectValue.value

    return { validateInput, selectValue }
  }
})
</script>

<style>
.pm-input-select.it-select {
    display: block;
}
</style>
