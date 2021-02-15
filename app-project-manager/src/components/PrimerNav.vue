<template>
  <div class="Header">

    <!-- Nav icon -->
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

    <!-- Nav link 'Dashboard' -->
    <div class="Header-item">
      <router-link
        class="Header-link"
        to="/"
      >Dash</router-link>
    </div>

    <!-- Nav link 'New' -->
    <div class="Header-item">
      <router-link
        class="Header-link"
        to="/new"
      >New</router-link>
    </div>

    <!-- Nav link 'Planner' -->
    <div 
      class="Header-item"
      v-if="hasProjectToBePlanned"
    >
      <router-link
        class="Header-link anim-pulse"
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
