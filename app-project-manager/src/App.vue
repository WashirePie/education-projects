<template>
  <!-- Webkit dragbar -->
  <div class="pm-dragbar" />

  <!-- Navigation component -->
  <Nav />

  <!-- Views -->
  <div class="mx-3 my-3">
    <router-view v-slot="{ Component }">
      <keep-alive include="Planner" v-if="hasProjectToBePlanned">
        <component :is="Component" />
      </keep-alive>
      <component v-else :is="Component" />
    </router-view>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import Nav from "./components/Nav.vue";
import { useStore } from "./store";

export default defineComponent({
  name: "Dashboard",
  components: {
    Nav,
  },
  setup() {
    const store = useStore();
    const hasProjectToBePlanned: ComputedRef<boolean> = computed(() => store.state.projectToBePlanned != null);

    return {
      hasProjectToBePlanned,
    };
  },
});
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
  width: 10px;
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
</style>
