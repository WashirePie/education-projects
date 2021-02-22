<template>
  <div v-if="milestones.length">
    <p class="f5 text-bold mt-3">Milestones</p>
    <div class="Box Box--condensed mt-2">
      <div
        class="Box-row"
        v-for="milestone in milestones" :key="milestone.name"
      >
        <span><b>{{ milestone.name }}</b>&nbsp;&nbsp;</span>
        <span> review date </span>
        <span class="Counter ml-1">📅 {{ milestone.reviewDate.toLocaleDateString() }}</span>
        <span> referenced activities </span>
        <span class="Counter ml-1">{{ milestone.activities.length }}</span>
        <div class="float-right ">
          <button
            class="btn-octicon btn-octicon-danger v-align-top"
            type="button"
            @click="removeMilestone(milestone)"
          >
            <Octicon octicon="x" />
          </button>
        </div>
      </div>
    </div>  
  </div>
</template>

<script lang="ts">
import Octicon from '@/components/Octicon.vue'
import { Milestone } from '@/classes/milestone';
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: 'ListMilestones',
  components: {
    Octicon
  },
  props: {
    milestones: {
      type: Array as PropType<Array<Milestone>>,
      required: true
    }
  },
  emits: ['removeMilestone'],
  setup(props, { emit })
  {
    const removeMilestone = (milestone: Milestone) => emit('removeMilestone', milestone)

    return {
      removeMilestone
    }
  }
})
</script>