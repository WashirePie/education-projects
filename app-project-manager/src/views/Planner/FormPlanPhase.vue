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
    <p class="note">(Cannot change start date when there are activities assigned to this phase)</p>
  </div>

  <!-- End date paragraph -->
  <span class="f5 text-bold mt-3 d-block">Projected end date</span>
  <span class="text-small text-gray mt-2 d-block">Computed from the assigned activities. This date will also mark the review date of this phase</span>
  <p class="f5 d-block mt-2">{{ projectedEndDate.toLocaleDateString() }}</p>

  <!-- Activities list -->
  <ListActivities
    :activities="phase.activities"
    @removeActivity="removeActivity"
  />

  <!-- Milestones list -->
  <ListMilestones
    :milestones="phase.milestones"
    @removeMilestone="removeMilestone"
  />

  <!-- DocumentRefs list -->
  <ListDocuments
   :documents="phase.documents"
   @removeDocument="removeDocument"
  />

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
    @click="phase.addDocuments()"
  >
    <Octicon octicon="plus" />
    <span>Add Documents</span>
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

  <ModalFormPlanMilestone
    v-if="showMilestonePlanner"
    :show="true"
    @discard="showMilestonePlanner = false"
    @done="showMilestonePlanner = false"
    :phase="phase"
  />

</template>

<script lang="ts">
import InputFieldDate from '@/components/InputFieldDate.vue'
import InputFieldOrderableText from '@/components/InputFieldOrderableText.vue'
import ListDocuments from '@/components/ListDocuments.vue'
import ListMilestones from '@/components/ListMilestones.vue'
import ListActivities from '@/components/ListActivities.vue'
import Octicon from '@/components/Octicon.vue'
import ModalFormPlanActivity from './ModalFormPlanActivity.vue'
import ModalFormPlanMilestone from './ModalFormPlanMilestone.vue'
import { computed, ComputedRef, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { Phase } from '@/classes/phase'
import { Project } from '@/classes/project'
import { Activity } from '@/classes/activity'
import { Milestone } from '@/classes/milestone'
import { DocumentRef } from '@/classes/document'

export default defineComponent({
  name: 'FormPlanPhase',
  components: {
    InputFieldDate,
    InputFieldOrderableText,
    ListDocuments,
    ListMilestones,
    ListActivities,
    Octicon,
    ModalFormPlanActivity,
    ModalFormPlanMilestone,
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

    const removeMilestone = (milestone: Milestone) => props.phase.removeMilestone(milestone)
    const removeDocument = (document: DocumentRef) => props.phase.removeDocument(document)
    
    watch([showActivityPlanner, showMilestonePlanner], () => validatePhase())
    onMounted(() => validatePhase())

    return { 
      setStartDate,
      removeActivity,
      removeMilestone,
      removeDocument,
      projectedEndDate,
      phaseStartDateField, 
      showActivityPlanner,
      showMilestonePlanner,
      errorMessage,
    }
  }
})
</script>
