<template>
  <!-- Activities list -->
  <div v-if="phase.activities.length">
    <p class="f3 text-bold">Activities</p>
    <div class="Box Box--condensed mt-4">
      <div
        v-for="activity in phase.activities" :key="activity.id"
        class="Box-row Box-row--hover-blue clickable"
        @click="activityToBeManaged = activity; showActivityManager = true"
      >
        <span class="mr-2">{{ activity.title }}</span>
        <span class="Counter mr-2">💰 {{ activity.getTotalCost() }}CHF</span>
        <span class="Counter mr-2">⌛ {{ activity.getTotalWorkload() }} hours</span>

        <div class="float-right ">
          <span class="Label mx-2">🗝️ {{ activity.id }}</span>
          <p class="f6 d-inline">{{activity.startDate.toLocaleDateString() }} - {{ activity.endDate.toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Milestones list -->
  <div v-if="phase.milestones.length">
    <p class="f3 text-bold my-4">Milestones</p>
    <div class="Box Box--condensed mt-2">

      <div
        v-for="milestone in phase.milestones" :key="milestone.name"
        class="Box-row "
        :class="phase.getMilestoneEvaluatable(milestone) ? 'Box-row--unread Box-row--hover-blue clickable' : ''"
        @click="openMilestoneManager(milestone)"
      >
        <span class="mr-2">{{ milestone.name }}</span>
        <span 
          v-if="milestone.isEvaluated"
          class="IssueLabel bg-green text-white mr-2">✔️ Evaluated ({{ milestone.state }})</span>
        <span class="IssueLabel bg-gray-2 mr-2">👁️‍🗨️ {{ milestone.activities.length }}</span>
        <p class="note">Watched activities Progress</p>
        <MilestoneProgress
          :milestone="milestone"
          :phase="phase"
        />
      </div>
    </div>
  </div>

  <!-- DocumentRefs list -->
  <ListDocuments
   :documents="phase.documents"
   @removeDocument="removeDocument"
  />

  <!-- 'Add' Documents buttons -->
  <button
    class="btn mt-4"
    type="button"
    @click="phase.addDocuments()"
  >
    <Octicon octicon="plus" />
    <span>Add Phase Documents</span>
  </button>

  <!-- Error message -->
  <p
    class="note text-red"
    v-if="errorMessage"
  >{{ errorMessage }}</p>

  <!-- Activity modal -->
  <ModalFormManageActivity 
    v-if="showActivityManager"
    :show="true"
    @discard="showActivityManager = false"
    @done="showActivityManager = false"
    :activity="activityToBeManaged"
  />

  <!-- Milestone modal -->
  <ModalFormManageMilestone
    v-if="showMilestoneManager"
    :show="true"
    @discard="showMilestoneManager = false"
    @done="showMilestoneManager = false"
    @cancelProject="cancelProject"
    :phase="phase"
    :milestone="milestoneToBeManaged"
  />

</template>

<script lang="ts">
import ListDocuments from '@/components/ListDocuments.vue'
import MilestoneProgress from './MilestoneProgress.vue'
import ModalFormManageActivity from './ModalFormManageActivity.vue'
import ModalFormManageMilestone from './ModalFormManageMilestone.vue'
import Octicon from '@/components/Octicon.vue'
import { defineComponent, PropType, reactive, ref } from 'vue'
import { Phase } from '@/classes/phase'
import { Project } from '@/classes/project'
import { DocumentRef } from '@/classes/document'
import { Activity } from '@/classes/activity'
import { Milestone } from '@/classes/milestone'

export default defineComponent({
  name: 'FormPlanPhase',
  components: {
    ListDocuments,
    MilestoneProgress,
    ModalFormManageActivity,
    ModalFormManageMilestone,
    Octicon,
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
  emits: ['cancelProject'],
  setup(props, { emit })
  {
    const errorMessage         = ref<string>('')

    const showActivityManager  = ref<boolean>(false)
    const showMilestoneManager = ref<boolean>(false)

    const openMilestoneManager = (milestone: Milestone) =>
    {
      if (props.phase.getMilestoneEvaluatable(milestone))
      {
        milestoneToBeManaged.value = milestone; 
        showMilestoneManager.value = true
      }
    }

    const cancelProject = () =>
    {
      showMilestoneManager.value = false
      emit('cancelProject')
    }

    const removeDocument = (document: DocumentRef) => props.phase.removeDocument(document)

    const activityToBeManaged  = ref<Activity | null>(null)
    const milestoneToBeManaged = ref<Milestone | null>(null)

    return {
      removeDocument,
      cancelProject,
      openMilestoneManager,
      showActivityManager,
      showMilestoneManager,
      activityToBeManaged,
      milestoneToBeManaged,
      errorMessage,
    }
  }
})
</script>

<style lang="scss">
  .clickable {
    cursor: pointer;
  }
</style>