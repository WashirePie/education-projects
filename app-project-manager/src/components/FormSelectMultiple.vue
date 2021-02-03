<template>
  <div class="pm-input-select-multiple">
    <it-checkbox
      v-for="source in inputItems"
      :key="source.label"
      v-model="source['state']"
      :type="source['type']"
      :label="source['label']"
    />
  </div>

  <br>

  <it-alert
    v-if="inputMessage"
    type="danger"
    :title="'Content not valid'"
    :body="inputMessage"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    inputName: {
      type: String,
      default: 'Generic Select-Multiple Input'
    },
    inputSource: {
      type: Array,
      default: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  setup (props)
  {
    // Extend inputSource with configurable <it-checkbox> properties
    const inputItems = ref(props.inputSource.map(s =>
    {
      return { state: false, type: 'primary', label: s }
    }))

    const inputMessage = ref('')

    const validateInput = (minSelected = 1, maxSelected = inputItems.value.length) =>
    {
      /* eslint-disable indent */
      const selected = inputItems.value.filter(i => i.state).length
      const validation = selected < minSelected ? `'${props.inputName}' should have at least ${minSelected} item${minSelected == 1 ? '' : 's'} selected`
                       : selected > maxSelected ? `'${props.inputName}' should have no more than ${maxSelected} item${minSelected == 1 ? '' : 's'} selected`
                       : ''

      if (validation)
        inputMessage.value = validation
      else
        return inputItems.value
          .filter(i => i.state)
          .map(i => i.label)

      return null
    }

    return { validateInput, inputItems, inputMessage }
  }
})
</script>

<style lang="scss">
.pm-input-select-multiple {
  label {
    margin-bottom: 5px;
  }
}
</style>
