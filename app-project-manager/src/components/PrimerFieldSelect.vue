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
    <select
      v-model="inputValue"
      :class="`form-select ${darkMode ? 'input-dark' : ''} ${errorMessage ? 'border-red' : ''}`"
      :id="inputName"
    >
      <option>{{ placeHolder }}</option>
      <option
        v-for="option in selectOptions" :key="option.name"
      >{{ option.name }}</option>
    </select>

    <p
      class="note text-red"
      v-if="errorMessage"
    >{{ errorMessage }}</p>
  </div>

</template>

<script lang="ts">
import { PrimerSelectItem } from '@/interfaces/primerField'
import { defineComponent, onMounted, watch, ref, PropType } from 'vue'

export default defineComponent({
  props: {
    inputName: {
      type: String,
      default: 'Generic Select Input'
    },
    inputDescription: {
      type: String,
      default: ''
    },
    selectOptions: {
      type: Array as PropType<Array<PrimerSelectItem>>,
      default: () => ([{ name: 'Low', payload: 1 }, { name: 'Medium', payload: 2 }, { name: 'High', payload: 3 }])
    },
    darkMode: {
      type: Boolean,
      default: false
    },
    placeHolder: {
      type: String,
      default: 'Choose an option'
    }
  },
  setup(props)
  {
    const inputValue   = ref<string>('')
    const errorMessage = ref<string>('')

    onMounted(() => inputValue.value = props.placeHolder)

    watch(inputValue, () => errorMessage.value = '')

    const validateInput = (): PrimerSelectItem['payload'] =>
    {
      if (inputValue.value == props.placeHolder)
      {
        errorMessage.value = `'${props.inputName}' must specify a value`
        return null
      }
      else
      {
        errorMessage.value = ''
        return props.selectOptions.filter(o => o.name == inputValue.value)[0].payload
      }
    }

    return { 
      validateInput, 
      errorMessage, 
      inputValue
    }
  }
})
</script>

<style>

</style>
