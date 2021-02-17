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

  <button
    class="btn d-block mt-3"
    type="button"
    @click="showActivityPlanner = true"
  >
    <PrimerIcon octicon="plus" />
    <span>Add Activities</span>
  </button>

  <button
    class="btn btn-primary mt-4"
    type="button"
    @click="savePlannedPhase"
  >
    <PrimerIcon octicon="download" />
    <span>Save</span>
  </button>

  <p class="f5 my-3 d-block" v-for="activity in phaseToBePlanned.activities" :key="activity.id">
    {{ activity.id }} | {{ activity.title }} Resource Count: {{ activity.resources.length }}
  </p>

  <!-- Error message -->
  <p
    class="note text-red"
    v-if="errorMessage"
  >{{ errorMessage }}</p>

  <!-- Activity modal -->
  <ModalFormPlanActivity 
    :show="showActivityPlanner"
    @discard="showActivityPlanner = false"
    @done="showActivityPlanner = false"
    :parentPhase="phaseToBePlanned"
  />

</template>

<script lang="ts">
import PrimerFieldArrayText from '@/components/PrimerFieldArrayText.vue'
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import PrimerIcon from '@/components/PrimerIcon.vue'
import ModalFormPlanActivity from './ModalFormPlanActivity.vue'
import { defineComponent, onMounted, PropType, Ref, ref, watch } from 'vue'
import { Phase } from '@/interfaces/phase'
import { EProjectState } from '@/interfaces/project'
import { EValidationTypes } from '@/helpers/validators'

export default defineComponent({
  name: 'FormPlanPhase',
  components: {
    PrimerFieldText,
    PrimerFieldArrayText,
    PrimerIcon,
    ModalFormPlanActivity
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

    const showActivityPlanner  = ref<boolean>(false)
    const errorMessage = ref<string>('')

    onMounted(() =>
    {
      // Prefill inputs if phase has already been planned
      if (props.phaseToBePlanned.state == EProjectState.WAITING)
      {
        phaseStartDateField.value.inputValue = props.phaseToBePlanned.startDate.toLocaleDateString()
        phaseEndDateField.value.inputValue = props.phaseToBePlanned.endDate.toLocaleDateString()
      }
    })

    // Reset error message when the activity planner was opened / closed
    watch(showActivityPlanner, () => errorMessage.value = '')

    const savePlannedPhase = () =>
    {
      const startDate: Date = phaseStartDateField.value.validateInput(EValidationTypes.textDateValidation, null)
      const endDate: Date   = phaseEndDateField.value.validateInput(EValidationTypes.textDateValidation, null)
      
      let valid = false

      if (startDate && endDate)
        valid = true

      if (startDate > endDate) 
      {
        phaseStartDateField.value.errorMessage = 'Start date must be before end date'
        valid = false
      }
      
      if (startDate < props.projectStartDate)
      {
        phaseStartDateField.value.errorMessage = 'Start date cannot be before project start date'
        valid = false
      }

      if (!props.phaseToBePlanned.activities.length)
      {
        errorMessage.value = 'A phase needs at least one activity'
        valid = false
      }

      if (valid)
      {
        props.phaseToBePlanned.startDate = startDate
        props.phaseToBePlanned.endDate = endDate
        props.phaseToBePlanned.state = EProjectState.WAITING
      }
      else
        props.phaseToBePlanned.state = EProjectState.PLANNING
    }

    return { 
      savePlannedPhase, 
      phaseStartDateField, 
      phaseEndDateField,
      showActivityPlanner,
      errorMessage,
    }
  }
})
</script>
