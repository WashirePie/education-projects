<template>
  <div class="Header">
    <!-- Nav icon -->
    <div class="Header-item">
      <a class="Header-link f4 d-flex flex-items-center">
        <Octicon octicon="package" :size="24" />
        <span class="ml-2">ProjectManager</span>
      </a>
    </div>

    <!-- Nav link 'Dashboard' -->
    <div class="Header-item">
      <router-link class="Header-link" to="/">
        Dash
        <div v-if="waitingProjectsCount" class="d-inline">
          <span
            class="tooltipped tooltipped-s d-inline"
            :aria-label="`${waitingProjectsCount} project${waitingProjectsCount > 1 ? 's' : ''} need${
              waitingProjectsCount > 1 ? '' : 's'
            } approval`"
          >
            <span class="Counter mr-1 bg-red text-white">{{ waitingProjectsCount }}</span>
          </span>
        </div>
      </router-link>
    </div>

    <!-- Nav link 'Planner' -->
    <div class="Header-item" v-if="hasProjectToBePlanned">
      <router-link class="Header-link" to="/plan">Planner</router-link>
    </div>

    <!-- Nav link 'Manager' -->
    <div class="Header-item" v-if="hasProjectToBeManaged">
      <router-link class="Header-link" to="/execute">Manager</router-link>
    </div>

    <div class="Header-item Header-item--full">&nbsp;</div>

    <!-- Exit App -->
    <div class="Header-item float-right">
      <a class="Header-link f4">
        <button class="btn-octicon btn-octicon-danger v-align-top" type="button" @click="closeApp">
          <Octicon octicon="x" />
        </button>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Octicon from "@/components/Octicon.vue";
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  name: "Nav",
  components: {
    Octicon,
  },
  setup() {
    const store = useStore();

    const hasProjectToBePlanned: ComputedRef<boolean> = computed(() => store.state.projectToBePlanned != null);

    const hasProjectToBeManaged: ComputedRef<boolean> = computed(() => store.state.projectToBeManaged != null);

    const waitingProjectsCount: ComputedRef<number> = computed(() => store.getters.waitingProjectsCount);

    const closeApp = () => {
      window.ipcRenderer.send("quit-app", "");
    };

    return {
      hasProjectToBePlanned,
      hasProjectToBeManaged,
      waitingProjectsCount,
      closeApp,
    };
  },
});
</script>

<style lang="scss">
a.router-link-exact-active {
  color: rgba(255, 255, 255, 0.7);
}
</style>
