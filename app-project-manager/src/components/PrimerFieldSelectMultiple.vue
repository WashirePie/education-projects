<template>
  <!-- Label & description -->
  <div class="form-group">
    <div class="form-group-header">
      <label :class="`${darkMode ? 'text-white' : ''}`">{{ inputName }}</label>
    </div>
    <span
      :class="`text-small ${darkMode ? 'text-white' : 'text-gray'}`"
      v-if="inputDescription"
    >{{ inputDescription }}</span>
  </div>

  <!-- Input field -->
  <div class="form-group-body">
    <div
      v-for="item in inputSource" :key="item.name"
      :class="`form-checkbox ${darkMode ? 'input-dark' : ''}`"
    >
      <label :class="`${errorMessage ? 'text-red' : ''}`">
        <input
          type="checkbox"
          v-model="item.state"
          :aria-describedby="item.name"
        />
        {{ item.name }}
      </label>
      <p
        class="note"
        :id="item.name"
      >{{ item.note }}</p>
    </div>

    <p
      class="note text-red"
      v-if="errorMessage"
    >{{ errorMessage }}</p>
  </div>

</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { IPrimerSelectMultipleItem } from '@/interfaces/primerField'

export default defineComponent({
  props: {
    inputName: {
      type: String,
      default: 'Generic Select Multiple Input'
    },
    inputDescription: {
      type: String,
      default: ''
    },
    inputSource: {
      type: Array as PropType<Array<IPrimerSelectMultipleItem>>,
      default: () => ([{ name: 'Option 1', note: 'Available', state: true, payload: 1 }, { name: 'Option 2', note: 'Available', state: false, payload: 1 }])
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  setup(props)
  {
    const errorMessage = ref<string>('')

    // TODO: Make the errorMessage reset upon changes in inputSource (When the user selects an item)
    const validateInput = (minSelected = 1, maxSelected = props.inputSource.length): IPrimerSelectMultipleItem['payload'] =>
    {
      const selected = props.inputSource.filter(i => i.state).length

      const validation = selected < minSelected ? `'${props.inputName}' should have at least ${minSelected} item${minSelected == 1 ? '' : 's'} selected`
                       : selected > maxSelected ? `'${props.inputName}' should have no more than ${maxSelected} item${minSelected == 1 ? '' : 's'} selected`
                       : ''

      if (validation)
        errorMessage.value = validation
      else
      {
        errorMessage.value = ''
        return props.inputSource.filter(i => i.state).map(i => i.payload)
      }

      return null
    }

    return { 
      validateInput, 
      errorMessage 
    }
  }
})
</script>
