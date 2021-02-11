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
      @keyup="addItem"
      type="text"
      v-model="inputValue"
      v-bind:placeholder="placeHolder"
    />

    <p
      class="note text-red"
      v-if="errorMessage"
    >{{ errorMessage }}</p>

    <div class="my-3"></div>

    <div class="Box">
      <div
        class="Box-row"
        v-for="item in items"
        :key="item"
      >
        <span>{{ item }}</span>
        <div class="float-right ">
          <button
            class="btn-octicon"
            type="button"
            @click="changeOrder(item, -1)"
          >
            <ChevronUpIcon />
          </button>
          <button
            class="btn-octicon"
            type="button"
            @click="changeOrder(item, 1)"
          >
            <ChevronDownIcon />
          </button>
          <button
            class="btn-octicon btn-octicon-danger"
            type="button"
            @click="removeItem(item)"
          >
            <XIcon/>
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { genericTextValidation } from '@/helpers/validators'
import { defineComponent, ref } from 'vue'
import XIcon from '@/components/octicons/XIcon.vue'
import ChevronUpIcon from '@/components/octicons/ChevronUpIcon.vue'
import ChevronDownIcon from '@/components/octicons/ChevronDownIcon.vue'

export default defineComponent({
  components: {
    XIcon,
    ChevronUpIcon,
    ChevronDownIcon
  },
  props: {
    inputName: {
      type: String,
      default: 'Generic Array Text Input'
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
    const inputValue   = ref<string>('')
    const errorMessage = ref<string>('')
    const items        = ref<Array<string>>([])

    const addItem = (event: KeyboardEvent) =>
    {
      // Check if ',' was pressed and there's a value inside the input field
      if (event.code === 'Comma' && inputValue.value)
      {
        // Grab a temporary reference and trim trailing comma
        const tempItem = inputValue.value.substr(0, inputValue.value.length - 1)

        // Validate phase titles
        const validation = genericTextValidation(props.inputName, tempItem, 2, 60, true, items.value)

        // Handle validation
        if (validation)
        {
          errorMessage.value = validation
          inputValue.value = tempItem
        }
        else
        {
          errorMessage.value = ''
          items.value.push(tempItem)
          inputValue.value = ''
        }
      }
      else
      {
        errorMessage.value = ''
      }
    }
    const removeItem = (itemToRemove: string) => items.value = items.value.filter(i => i != itemToRemove)

    const changeOrder = (selectedItem: string, change: number) =>
    {
      // Grab indices
      const oldIndex = items.value.indexOf(selectedItem)
      const newIndex = oldIndex + change

      // Check edge cases
      if (!(newIndex < 0 || newIndex > items.value.length - 1))
      {
        // Swap
        const temp = items.value[newIndex]
        items.value[newIndex] = selectedItem
        items.value[oldIndex] = temp
      }
    }

    const validateInput = (minItems = 1) =>
    {
      if (items.value.length >= minItems)
      {
        errorMessage.value = ''
        return items.value.map(v => v)
      }
      else
      {
        errorMessage.value = `'${props.inputName}' must specify at least ${minItems} item${minItems == 1 ? '' : 's'}`
        return null
      }
    }

    return { 
      items, 
      inputValue, 
      errorMessage, 
      addItem, 
      removeItem, 
      changeOrder, 
      validateInput 
    }
  }
})
</script>
