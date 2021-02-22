<template>

  <div v-if="approachModels.length">

    <h3 class="f3-light my-2">Approach Models</h3>
    
    <div class="Box mt-2">
      <div
        class="Box-row"
        v-for="amp in approachModels" :key="amp.title"
      >
        <Octicon octicon="package" class="circle d-inline mt-1 mr-2" />
        <span><b>{{ amp.title }}</b>&nbsp;&nbsp;</span>
        
        <details class="details-reset">
          <summary class="btn mt-1 btn-sm">View Phases</summary>
          <div class="border p-3 mt-2">
            <p
              class="d-block note"
              v-for="ampPh in amp.phases" :key="ampPh"
            >
              {{ ampPh}}
            </p>
          </div>
        </details>
      </div>
    </div>   
     
  </div>

</template>

<script lang="ts">
import Octicon from '@/components/Octicon.vue'
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { ApproachModel } from '@/classes/approachModel';

export default defineComponent({
  name: 'WidgetApproachModels',
  components: {
    Octicon
  },
  setup() 
  {
    const store = useStore()

    const approachModels: ComputedRef<Array<ApproachModel>> = computed(() => store.state.approachModels )

    return {
      approachModels
    }
  }
})
</script>