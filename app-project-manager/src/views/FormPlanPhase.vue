<template>
  <!-- Title -->
  <div class="Subhead hx_Subhead--responsive mb-5">
    <h1 class="Subhead-heading ">
      Plan Phase <b>{{ phaseToBePlanned?.title }}</b>
    </h1>
  </div>

  <!-- {{ phase.activities }}
  {{ phase.phaseMilestone }}
  {{ phase.milestones }}
  {{ phase.startDate }}
  {{ phase.endDate }}
  {{ phase.approvalDate }}
  {{ phase.state }}
  {{ phase.documents }} -->

  <!-- Form components -->
  <PrimerFieldText
    ref="startDateField"
    inputName="Start date"
    inputDescription="Set the start date of this phase"
    :placeHolder="new Date().toLocaleDateString()"
  />

  <PrimerFieldText
    ref="endDateField"
    inputName="End date"
    inputDescription="Set the end date of this phase"
    :placeHolder="new Date().toLocaleDateString()"
  />
</template>

<script lang="ts">
import PrimerFieldArrayText from '@/components/PrimerFieldArrayText.vue'
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import { computed, ComputedRef, defineComponent, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { ActionTypes } from '@/store/actions'
import { Phase } from '@/interfaces/phase'
import { EProjectState } from '@/interfaces/project'

export default defineComponent({
  name: 'FormPlanPhase',
  components: {
    PrimerFieldText,
    PrimerFieldArrayText
  },
  setup()
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()

    // Setup references for the form fields
    const startDateField  = ref<Ref | null>(null)
    const endDateField    = ref<Ref | null>(null)

    const phaseToBePlanned: ComputedRef<Phase | null> = computed(() => store.state.phaseToBePlanned )

    const validateForm = (): Promise<string> =>
    {
      return new Promise<string>((resolve, reject) =>
      {
        const startDate = startDateField.value.validateInputDate()
        const endDate = endDateField.value.validateInputDate()

        if (startDate && endDate)
        {
          phaseToBePlanned.value!.startDate = startDate
          phaseToBePlanned.value!.endDate = endDate
          phaseToBePlanned.value!.state = EProjectState.WAITING
          console.log(phaseToBePlanned.value);
          
          resolve('Phase saved')
        }
        else reject(new Error('Not valid'))        
      })
    }

    return { 
      phaseToBePlanned,
      validateForm, 
      startDateField, 
      endDateField 
    }
  }
})
</script>
