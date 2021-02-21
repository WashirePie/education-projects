<template>
  <!-- Title -->
  <div class="Subhead hx_Subhead--responsive mb-5">
    <h1 class="Subhead-heading ">
      Plan Phase '<b>{{ phase?.title }}</b>'
    </h1>
  </div>

  <!-- Start date field -->
  <div v-if="!phase.activities.length">
    <InputFieldDate
      ref="phaseStartDateField"
      inputName="Start date"
      inputDescription="Set the start date of this phase"
      :placeHolder="phase.startDate"
      @valueChanged="setStartDate"
    />
  </div>
  <div v-else>
    <p class="f5 text-bold mt-3">Start date</p>
    <p class="f5 d-block">{{ phase.startDate.toLocaleDateString() }}</p>
    <p class="note">(Cannot change start date when activities were added)</p>
  </div>

  <!-- End date paragraph -->
  <span class="f5 text-bold mt-3 d-block">Projected end date</span>
  <span class="text-small text-gray mt-2 d-block">Computed from the assigned activities. This date will also mark the review date of this phase</span>
  <p class="f5 d-block mt-2">{{ projectedEndDate.toLocaleDateString() }}</p>

  <!-- Lists -->
  <div v-if="phase.activities.length">
    <p class="f5 text-bold mt-3">Activities</p>
      <div class="Box Box--condensed mt-2">
        <div
          class="Box-row"
          v-for="activity in phase.activities" :key="activity.id"
        >
          <span><b>{{ activity.title }}</b>&nbsp;&nbsp;</span>
          <span> total cost </span>
          <span class="Counter ml-1">💰 {{ activity.getTotalCost() }}CHF</span>
          <span> total workhours </span>
          <span class="Counter ml-1">⌛ {{ activity.getTotalWorkload() }} hours</span>
          <div class="float-right ">
            <button
              class="btn-octicon btn-octicon-danger v-align-top"
              type="button"
              @click="removeActivity(activity)"
            >
              <Octicon octicon="x" />
            </button>
          </div>
        </div>
      </div>
  </div>

  <div v-if="phase.milestones.length">
    <p class="f5 text-bold mt-3">Milestones</p>
    <p class="f5 my-3 d-block" v-for="activity in phase.activities" :key="activity.id">
      {{ activity.id }} | {{ activity.title }} Resource Count: {{ activity.resources.length }}
    </p>
  </div>
  
  <div v-if="phase.documents.length">
    <p class="f5 text-bold mt-3">Documents</p>
    <p class="f5 my-3 d-block" v-for="activity in phase.activities" :key="activity.id">
      {{ activity.id }} | {{ activity.title }} Resource Count: {{ activity.resources.length }}
    </p>
  </div>

  <hr>

  <!-- Add - Activity, Milestone or Documents buttons -->
  <button
    class="btn"
    type="button"
    @click="showActivityPlanner = true"
  >
    <Octicon octicon="plus" />
    <span>Add Activity</span>
  </button>

  <button
    class="btn ml-2"
    type="button"
    @click="showMilestonePlanner = true"
  >
    <Octicon octicon="plus" />
    <span>Add Milestone</span>
  </button>

  <button
    class="btn ml-2"
    type="button"
    @click="showDocumentPlanner = true"
  >
    <Octicon octicon="plus" />
    <span>Add Document</span>
  </button>


  <!-- Error message -->
  <p
    class="note text-red"
    v-if="errorMessage"
  >{{ errorMessage }}</p>

  <!-- Activity modal -->
  <ModalFormPlanActivity 
    v-if="showActivityPlanner"
    :show="true"
    @discard="showActivityPlanner = false"
    @done="showActivityPlanner = false"
    :phase="phase"
  />

</template>

<script lang="ts">
import InputFieldDate from '@/components/InputFieldDate.vue'
import InputFieldOrderableText from '@/components/InputFieldOrderableText.vue'
import Octicon from '@/components/Octicon.vue'
import ModalFormPlanActivity from './ModalFormPlanActivity.vue'
import { computed, ComputedRef, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { Phase } from '@/classes/phase'
import { Project } from '@/classes/project'
import { Activity } from '@/classes/activity'

export default defineComponent({
  name: 'FormPlanPhase',
  components: {
    InputFieldDate,
    InputFieldOrderableText,
    Octicon,
    ModalFormPlanActivity
  },
  props: {
    phase: {
      type: Object as PropType<Phase>,
      required: true
    },
    project: {
      type: Object as PropType<Project>,
      required: true
    },
  },
  setup(props)
  {
    // Setup references for the form fields
    const phaseStartDateField  = ref<InstanceType<typeof InputFieldDate>>()

    const showActivityPlanner  = ref<boolean>(false)
    const showMilestonePlanner = ref<boolean>(false)
    const showDocumentPlanner  = ref<boolean>(false)
    const errorMessage         = ref<string>('')

    const projectedEndDate: ComputedRef<Date> = computed(() => props.phase.endDate)

    const validatePhase = () =>
    {
      try 
      {
        props.phase.plan(props.project)
        errorMessage.value = ''
      }
      catch (error)
      {
        errorMessage.value = error.message
      }
    }

    const setStartDate = () =>
    {
      const startDate = phaseStartDateField.value!.validateInput({ minDate: props.project.startDate })

      if (startDate)
      {
        props.phase.setStartDate(startDate, props.project)
        validatePhase()
      }
    }

    const removeActivity = (activity: Activity) => 
    {
      props.phase.removeActivity(activity)
      validatePhase()
    }
    
    watch([showActivityPlanner, showMilestonePlanner, showDocumentPlanner], () => 
    {
      validatePhase()
    })

    onMounted(() => 
    {
      validatePhase()
    })

    return { 
      setStartDate,
      removeActivity,
      projectedEndDate,
      phaseStartDateField, 
      showActivityPlanner,
      errorMessage,
    }
  }
})
</script>
