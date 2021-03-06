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
import { useStore } from "./store";
import Nav from "./components/Nav.vue";

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
::-webkit-scrollbar {
  display: none;
  background-color: #ffffff;
  width: 10px;
}

::-webkit-scrollbar-thumb:window-inactive,
::-webkit-scrollbar-thumb {
  background: #f1f0f5;
  border-radius: 5px;
}

.pm-dragbar {
  height: 10px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: #282e33;
  -webkit-app-region: drag;
}
</style>