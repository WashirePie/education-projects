<template>

  <div v-if="costTypes.length">

    <h3 class="f3-light my-2">Cost Types</h3>
    
    <div class="Box Box--condensed mt-2">
      <div
        class="Box-row"
        v-for="ct in costTypes" :key="ct.title"
      >
        <span><b>{{ ct.title }}</b>&nbsp;&nbsp;</span>
        <span class="Label Label--gray-darker mr-2">🗝️ {{ ct.id }} </span> 
      </div>
    </div>   
     
  </div>

</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { CostType } from '@/classes/costType';

export default defineComponent({
  name: 'WidgetCostTypes',
  setup() 
  {
    const store = useStore()

    const costTypes: ComputedRef<Array<CostType>> = computed(() => store.state.costTypes )

    return {
      costTypes
    }
  }
})
</script>