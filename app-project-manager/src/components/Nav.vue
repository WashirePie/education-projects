<template>
  <div class="Header">

    <!-- Nav icon -->
    <div class="Header-item">
      <a class="Header-link f4 d-flex flex-items-center">
        <Octicon octicon="package" :size="24"/>
        <span>ProjectManager</span>
      </a>
    </div>

    <!-- Nav link 'Dashboard' -->
    <div class="Header-item">
      <router-link
        class="Header-link"
        to="/"
      >Dash</router-link>
    </div>

    <!-- Nav link 'Planner' -->
    <div 
      class="Header-item"
      v-if="hasProjectToBePlanned"
    >
      <router-link
        class="Header-link"
        to="/plan"
      >Planner</router-link>
    </div>

    <!-- Nav avatar -->
    <div class="Header-item mr-0">
      <img
        class="avatar"
        height="20"
        alt="@octocat"
        src="@/assets/logo.png"
        width="20"
      >
    </div>
  </div>
</template>

<script lang="ts">
import Octicon from '@/components/Octicon.vue'
import { computed, ComputedRef, defineComponent } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Nav',
  components: {
    Octicon
  },
  setup()
  {
    const store = useStore()

    const hasProjectToBePlanned: ComputedRef<boolean> = computed(() => store.state.projectToBePlanned != null )

    return {
      hasProjectToBePlanned
    }
  }
})
</script>

<style lang="scss">
a.router-link-exact-active {
  color: rgba(255,255,255,0.7);
}
</style>
