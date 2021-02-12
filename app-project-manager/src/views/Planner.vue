<template>

  <div class="container-lg my-6 px-lg-5">
    <div class="TimelineItem">
      <div class="TimelineItem-badge bg-red text-white">
        <AlertIcon />
      </div>
      <div class="TimelineItem-body">
        Red background used when closed events occur
      </div>
    </div>  

    <div class="TimelineItem">
      <div class="TimelineItem-badge bg-green text-white">
        <CheckIcon />
      </div>
      <div class="TimelineItem-body">
        Green background when opened or passed events occur
      </div>
    </div>

    <div class="TimelineItem-break ml-0"></div>
    
  </div>

</template>

<script lang="ts">
import CheckIcon from '@/components/octicons/CheckIcon.vue'
import AlertIcon from '@/components/octicons/AlertIcon.vue'
import { defineComponent } from "vue";

export default defineComponent({
  name: 'Planner',
  components: {
    CheckIcon,
    AlertIcon,
  }
})
</script>

<style lang="scss">

</style>