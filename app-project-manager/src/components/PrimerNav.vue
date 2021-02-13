<template>
  <div class="Header">

    <div class="Header-item">
      <a class="Header-link f4 d-flex flex-items-center">
        <PrimerIcon octicon="package" :size="24"/>
        <span>ProjectManager</span>
      </a>
    </div>

    <!-- <div class="Header-item">
      <input type="search" class="form-control input-dark" />
    </div> -->

    <!-- <div class="Header-item">
      Routes
    </div> -->

    <div class="Header-item">
      <router-link
        class="Header-link"
        to="/"
      >Dash</router-link>
    </div>

    <div class="Header-item">
      <router-link
        class="Header-link"
        to="/new"
      >New</router-link>
    </div>

    <div 
      class="Header-item"
      v-if="hasNewProject"
    >
      <router-link
        class="Header-link anim-pulse"
        to="/plan"
      >Planner</router-link>
    </div>

    <div class="Header-item Header-item--full">
      <!-- <a href="#" class="Header-link">About</a> -->
    </div>

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
import PrimerIcon from '@/components/PrimerIcon.vue'
import { computed, ComputedRef, defineComponent } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  components: {
    PrimerIcon
  },
  setup()
  {
    const store = useStore()

    const hasNewProject: ComputedRef<boolean> = computed(() => store.state.newProject != null )

    return {
      hasNewProject
    }
  }
})
</script>

<style lang="scss">
a.router-link-exact-active {
  color: rgba(255,255,255,0.7);
}
</style>
