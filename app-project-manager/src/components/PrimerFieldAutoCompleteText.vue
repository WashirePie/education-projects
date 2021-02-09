<template>
  <input
    class="form-control input-block input-dark"
    type="text"
    aria-label="Search"
    v-model="inputValue"
    v-bind:placeholder="placeHolder"
    v-on:keydown.prevent.up
    v-on:keydown.prevent.down
    v-on:keyup.prevent.up="selectedIndex <= 0 ? 0 : selectedIndex--"
    v-on:keyup.prevent.down="selectedIndex >= autoCompleteList.length -1 ? autoCompleteList.length -1 : selectedIndex++"
    v-on:keyup.enter.prevent="insertAutoCompleteItem"
  >
  <ul
    class="autocomplete-results bg-gray-dark"
    v-if="autoCompleteList.length"
    v-on:mouseover.prevent
  >
    <li
      class="autocomplete-item"
      :aria-selected="item.isSelected"
      v-for="item in autoCompleteList" :key="item.value"
    >{{ item.value }}</li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'

interface AutoCompleteItem {
  value: string;
  isSelected: boolean;
}

export default defineComponent({
  props: {
    placeHolder: {
      type: String,
      default: 'Placeholder'
    },
    autoCompleteItems: {
      type: Array as PropType<string[]>,
      default: () => (['Simon', 'Siiimon', 'Siiiimon', 'Siiiiiimon', '5', '6', '7'])
    }
  },
  setup(props)
  {
    const inputValue = ref<string>('')
    const selectedIndex = ref<number>(0)

    const autoCompleteList = computed((): Array<AutoCompleteItem> =>
    {
      /* eslint-disable indent */
      const list = inputValue.value ? props.autoCompleteItems.filter(i => i.startsWith(inputValue.value) && !(i == inputValue.value))
                                                             .map(i => ({ value: i, isSelected: false } as AutoCompleteItem))
                                    : props.autoCompleteItems.map(i => ({ value: i, isSelected: false } as AutoCompleteItem))

      if (list.length)
        list[selectedIndex.value].isSelected = true

      // Reset Selected Index
      watch(inputValue, () => selectedIndex.value = 0)

      return list
    })

    const insertAutoCompleteItem = () => inputValue.value = autoCompleteList.value[selectedIndex.value].value

    return { 
      inputValue, 
      selectedIndex, 
      autoCompleteList, 
      insertAutoCompleteItem 
    }
  }
})
</script>

<style lang="scss">

</style>
