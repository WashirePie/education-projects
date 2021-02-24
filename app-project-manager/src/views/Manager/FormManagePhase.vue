<template>
  <!-- Title -->
  <div class="Subhead hx_Subhead--responsive mb-5">
    <h1 class="Subhead-heading ">
      Phase '<b>{{ phase?.title }}</b>'
    </h1>
  </div>

  <!-- Activities list -->
  <div v-if="phase.activities.length">
    <p class="f5 text-bold mt-3">Activities</p>
    <div class="Box Box--condensed mt-2">
      <div
        class="Box-row"
        v-for="activity in phase.activities" :key="activity.id"
      >
        <span class="mr-2">{{ activity.title }}</span>
        <span class="Label mr-2">🗝️ {{ activity.id }}</span>
        <span class="Counter mr-2">💰 {{ activity.getTotalCost() }}CHF</span>
        <span class="Counter mr-2">⌛ {{ activity.getTotalWorkload() }} hours</span>

        <input type="number" v-model="activity.progress">
  
        <div class="float-right ">
          <p class="f6 d-inline">📅 {{activity.startDate.toLocaleDateString() }} - {{ activity.endDate.toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Milestones list -->
  <div v-if="phase.milestones.length">
    <p class="f5 text-bold mt-3">Milestones</p>
    <div class="Box Box--condensed mt-2">
      <div
        class="Box-row"
        v-for="milestone in phase.milestones" :key="milestone.name"
      >
        <span class="mr-2">{{ milestone.name }}</span>
        <span class="IssueLabel bg-gray-2 mr-2">👁️‍🗨️ {{ milestone.activities.length }}</span>

        <div class="float-right ">
          <p class="f6 d-inline">📅 {{ milestone.reviewDate.toLocaleDateString() }}</p>
        </div>

        <MilestoneProgress
          class="mt-2"
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

  <hr>

  <!-- 'Add' Documents buttons -->
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

</template>

<script lang="ts">
import ListDocuments from '@/components/ListDocuments.vue'
import MilestoneProgress from './MilestoneProgress.vue'
import Octicon from '@/components/Octicon.vue'
import { defineComponent, PropType, ref } from 'vue'
import { Phase } from '@/classes/phase'
import { Project } from '@/classes/project'
import { DocumentRef } from '@/classes/document'

export default defineComponent({
  name: 'FormPlanPhase',
  components: {
    ListDocuments,
    MilestoneProgress,
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
  setup(props)
  {
    const errorMessage         = ref<string>('')

    const removeDocument = (document: DocumentRef) => props.phase.removeDocument(document)
    
    return { 
      removeDocument,
      errorMessage,
    }
  }
})
</script>
