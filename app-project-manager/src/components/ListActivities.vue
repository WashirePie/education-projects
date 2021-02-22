<template>
  <div v-if="activities.length">
    <p class="f5 text-bold mt-3">Activities</p>
    <div class="Box Box--condensed mt-2">
      <div
        class="Box-row"
        v-for="activity in activities" :key="activity.id"
      >
        <span class="mr-2"><b>{{ activity.title }}</b></span>
        <span class="Label mr-2">🗝️ {{ activity.id }}</span>
        <span class="Counter mr-2">💰 {{ activity.getTotalCost() }}CHF</span>
        <span class="Counter mr-2">⌛ {{ activity.getTotalWorkload() }} hours</span>
  
        <div class="float-right ">
          <p class="f6 d-inline">📅 {{activity.startDate.toLocaleDateString() }} - {{ activity.endDate.toLocaleDateString() }}</p>
          <button
            class="btn-octicon btn-octicon-danger"
            type="button"
            @click="removeActivity(activity)"
          >
            <Octicon octicon="x" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Activity } from '@/classes/activity';
import Octicon from '@/components/Octicon.vue'
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: 'ListActivities',
  components: {
    Octicon
  },
  props: {
    activities: {
      type: Array as PropType<Array<Activity>>,
      required: true,
    }
  },
  emits: ['removeActivity'],
  setup(props, { emit })
  {
    const removeActivity = (activity: Activity) => emit('removeActivity', activity)

    return {
      removeActivity
    }
  }
})
</script>