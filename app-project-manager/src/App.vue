<template>
  <!-- Webkit dragbar -->
  <div class="pm-dragbar" />

  <!-- Navigation component -->
  <PrimerNav />

  <!-- Views -->
  <div class="mx-3 my-3">
    <router-view v-slot="{ Component }">
      <keep-alive include="Planner">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PrimerNav from './components/PrimerNav.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    PrimerNav
  },
  setup ()
  {
    // TODO: Add 'Milestones' to FormPlanPhase
    // TODO: Add 'DocumentRefs' to FormPlanPhase
    // TODO: Add 'DocumentRefs' to ModalFormPlanActivity
    // TODO: Refactor 'FieldResources'
    // TODO: Remove all interfaces for the base classes (Project, Phase, etc.)
    // TODO: Use type="number" on number PrimerFieldTexts -> Probably rename that component too...
    // TODO: an <option> has the ability to use 'value', which is essentially what we're doing with the IPrimerSelectValue Interface... Maybe refactor this
    return { }
  }
})
</script>

<style lang="scss">
// TODO: Move to global scss file @root-rules
// html, body { padding: 0; }
// body { margin: 0 }

// h1, h2, h3, h4, h5, p, a {
//   color: $color-font-main;
// }

// TODO: Move to global scss file @electron-stuff
::-webkit-scrollbar {
  display: none;
  background-color: $color-general;
  width: 10px
}

::-webkit-scrollbar-thumb:window-inactive,
::-webkit-scrollbar-thumb {
  background: $color-general-darker;
  border-radius: 5px;
}

.pm-dragbar {
  height: $dragbar-height;
  background: $color-dragbar;
  -webkit-app-region: drag;
}

// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
</style>
