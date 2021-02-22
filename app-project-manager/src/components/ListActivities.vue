<template>
  <div v-if="activities.length">
    <p class="f5 text-bold mt-3">Activities</p>
    <div class="Box Box--condensed mt-2">
      <div
        class="Box-row"
        v-for="activity in activities" :key="activity.id"
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