<template>
  <!-- Title -->
  <div class="Subhead hx_Subhead--responsive mb-5">
    <h1 class="Subhead-heading ">
      Plan Phase '<b>{{ phaseToBePlanned?.title }}</b>'
    </h1>
  </div>

  <!-- Form components -->
  <PrimerFieldText
    ref="phaseStartDateField"
    inputName="Start date"
    inputDescription="Set the start date of this phase"
    :placeHolder="phaseToBePlanned.startDate.toLocaleDateString()"
  />

  <PrimerFieldText
    ref="phaseEndDateField"
    inputName="End date"
    inputDescription="Set the end date of this phase"
    :placeHolder="phaseToBePlanned.endDate.toLocaleDateString()"
  />

  <FieldPlanActivity />
  <!-- {{ phase.activities }}
  {{ phase.phaseMilestone }}
  {{ phase.milestones }}
  // Done {{ phase.startDate }}
  // Done {{ phase.endDate }}
  // Done {{ phase.approvalDate }}
  // Done {{ phase.state }}
  {{ phase.documents }} -->
</template>

<script lang="ts">
import PrimerFieldArrayText from '@/components/PrimerFieldArrayText.vue'
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import FieldPlanActivity from './FieldPlanActivity.vue'
import { defineComponent, onMounted, PropType, Ref, ref } from 'vue'
import { Phase } from '@/interfaces/phase'
import { EProjectState } from '@/interfaces/project'
import { EValidationTypes } from '@/helpers/validators'

export default defineComponent({
  name: 'FormPlanPhase',
  components: {
    PrimerFieldText,
    PrimerFieldArrayText,
    FieldPlanActivity
  },
  props: {
    phaseToBePlanned: {
      type: Object as PropType<Phase>,
      required: true
    },
    projectStartDate: {
      type: Date as PropType<Date>,
      required: true
    }
  },
  setup(props)
  {
    // Setup references for the form fields
    const phaseStartDateField  = ref<Ref | null>(null)
    const phaseEndDateField    = ref<Ref | null>(null)

    onMounted(() =>
    {
      // Prefill inputs if phase has already been planned
      if (props.phaseToBePlanned.state == EProjectState.WAITING)
      {
        phaseStartDateField.value.inputValue = props.phaseToBePlanned.startDate.toLocaleDateString()
        phaseEndDateField.value.inputValue = props.phaseToBePlanned.endDate.toLocaleDateString()
      }
    })

    const validateForm = (): Promise<Phase> =>
    {
      return new Promise<Phase>((resolve, reject) =>
      {
        const startDate: Date = phaseStartDateField.value.validateInput(EValidationTypes.textDateValidation, null)
        const endDate: Date   = phaseEndDateField.value.validateInput(EValidationTypes.textDateValidation, null)
        
        if (startDate && endDate)
        {
          if (startDate > endDate)
          {
            phaseStartDateField.value.errorMessage = 'Start date must be before end date'
            reject(new Error('Not valid'))
          }
          if (startDate < props.projectStartDate)
          {
            phaseStartDateField.value.errorMessage = 'Start date cannot be before project start date'
            reject(new Error('Not valid'))
          }
          
          console.log(startDate, endDate);
          props.phaseToBePlanned.startDate = startDate
          props.phaseToBePlanned.endDate = endDate
          props.phaseToBePlanned.state = EProjectState.WAITING
          
          resolve(props.phaseToBePlanned)
        }
        else reject(new Error('Not valid'))        
      })
    }

    return { 
      validateForm, 
      phaseStartDateField, 
      phaseEndDateField 
    }
  }
})
</script>
