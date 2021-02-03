<template>
  <it-input
    v-model="inputValue"
    :status="inputState"
    :message="inputMessage"
    :label-top="inputLabel"
    @keyup="addItem"
  />

  <div
    v-if="items.length"
  >
    <h3>{{ inputName }}</h3>
    <transition-group
      name="transition-items"
      tag="div"
    >
      <div
        v-for="item in items"
        :key="item"
        class="pm-input-text-array-item transition-item"
      >
        <h4>{{ item }}</h4>

        <div>
          <it-button
            type="danger"
            icon="clear"
            @click="removeItem(item, 1)"
          />
          <it-button
            v-if="isSortable"
            icon="keyboard_arrow_up"
            @click="changeOrder(item, -1)"
          />
          <it-button
            v-if="isSortable"
            icon="keyboard_arrow_down"
            @click="changeOrder(item, 1)"
          />
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { genericTextValidation } from '@/helpers/validators'

export default defineComponent({
  props: {
    inputName: {
      type: String,
      default: 'Generic Text Array Input'
    },
    inputDesc: {
      type: String,
      default: ''
    },
    isSortable: {
      type: Boolean,
      default: false
    }
  },
  setup (props)
  {
    const inputLabel = props.inputName + props.inputDesc
    const inputState = ref<undefined | string>(undefined)
    const inputMessage = ref('')
    const inputValue = ref('')

    const items = ref<Array<string>>([])

    const addItem = (event: KeyboardEvent) =>
    {
      console.log(event)

      // Check if ',' was pressed and there's a value inside the input field
      if (event.code === 'Comma' && inputValue.value)
      {
        // Grab a temporary reference and trim trailing comma
        const tempItem = inputValue.value.substr(0, inputValue.value.length - 1)

        // Validate phase titles
        const validation = genericTextValidation(props.inputName, tempItem, 2, 60, items.value)

        // Handle validation
        if (validation)
        {
          inputState.value = 'danger'
          inputMessage.value = validation
          inputValue.value = tempItem
        }
        else
        {
          inputState.value = 'success'
          inputMessage.value = ''
          items.value.push(tempItem)
          inputValue.value = ''
        }
      }
      else
      {
        inputState.value = undefined
        inputMessage.value = ''
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
        inputState.value = 'success'
        return items.value.map(v => v)
      }
      else
      {
        inputState.value = 'danger'
        inputMessage.value = `'${props.inputName}' must specify at least ${minItems} item${minItems == 1 ? '' : 's'}`
        return null
      }
    }
    return { inputLabel, inputState, inputMessage, inputValue, validateInput, items, removeItem, addItem, changeOrder }
  }
})
</script>

<style lang="scss">
.transition-items-enter,
.transition-items-leave-to {
  opacity: 0;
}
.transition-items-leave-active {
  opacity: 0;
}

.pm-input-text-array-item {
  transition: all .5s;

  margin-bottom: 10px;
  padding-bottom: 5px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid $color-border;
  justify-content: space-between;

  h4 {
    max-width: 50ch;
    word-wrap: break-word;
    margin: auto 0;
    padding: 0 0;
  }

  div > button {
    margin-left: 5px;
    float: right;
  }
}
</style>
