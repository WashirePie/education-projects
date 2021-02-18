<template>
  <span 
    class="IssueLabel"
    :class="color == 'green'   ? 'bg-green text-white'      : 
            color == 'yellow'  ? 'bg-yellow text-gray-dark' :
            color == 'red'     ? 'bg-red text-white'        :
            color == 'primary' ? 'bg-blue text-white'       : 
            ''"
  >
    <slot>Label</slot>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: 'Label',
  props: {
    color: {
      type: String as PropType<'primary' | 'green' | 'yellow' | 'red'>,
      default: 'primary'
    },
  }
})
</script>