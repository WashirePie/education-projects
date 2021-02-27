<template>
  <div 
    class="tooltipped tooltipped-no-delay tooltipped-s"
    :aria-label="activityTitles"
  >
    <span class="Progress Progress--small">
      <span 
        v-for="item in activitiesProgress" :key="item.activityTitle"
        class="Progress-item"
        :class="item.color" 
        :style="`width: ${item.value}%;`"
      ></span>

    </span>
  </div>
</template>

<script lang="ts">
import { Milestone } from "@/classes/milestone";
import { Phase } from "@/classes/phase";
import { computed, ComputedRef, defineComponent, PropType } from "vue";

interface IProgressItem
{
  value: number
  color: string
  activityTitle: string
}

export default defineComponent({
  name: 'MilestoneProgress',
  props: {
    milestone: {
      type: Object as PropType<Milestone>,
      required: true
    },
    phase: {
      type: Object as PropType<Phase>,
      required: true
    }
  },
  setup(props)
  {
    const colors = ['bg-green','bg-purple','bg-pink','bg-blue','bg-orange','bg-yellow','bg-red']

    const activitiesProgress: ComputedRef<Array<IProgressItem>> = computed(() =>
    {
      let progressItems: Array<IProgressItem> = props.phase.getMilestoneActivities(props.milestone).map((a, i) => 
      {
        return {
          value: a.progress,
          color: colors[i % colors.length],
          activityTitle: `'${a.title}': ${a.progress}%`
        }
      })  

      progressItems.map(p => p.value = p.value / progressItems.length)

      return progressItems
    })

    const activityTitles: ComputedRef<string> = computed(() =>
    {
      return activitiesProgress.value.map(p => p.activityTitle).reduce((a, c) => a + ` | ${c}`)
    })    

    return {
      activitiesProgress,
      activityTitles
    }
  }
})
</script>
