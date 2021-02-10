<template>
  <div class="container-xl my-5 px-3 px-md-4 px-lg-5">
    <button
      class="btn btn-primary mr-2"
      type="button"
    >Plan a new Project</button>
  </div>


</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Dashboard',
  components: {
  },
  setup() 
  {
    const store = useStore()

    return { }
  }
})
</script>

<style lang="scss">
</style>
