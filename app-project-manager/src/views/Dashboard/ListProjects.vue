<template>
  <div v-if="projects.length">
    <h3 class="f3-light my-2">Projects</h3>

    <div class="Box mt-2">
      <div
        v-for="proj in projects"
        :key="proj.pId"
        class="Box-row"
        :class="`${proj.isAwaitingApproval ? 'Box-row--unread' : ''} 
                 ${proj.isExecuting || proj.isAwaitingApproval ? 'clickable Box-row--hover-blue' : ''}`"
        @click="informClicked(proj)"
      >
        <h4 class="f4 d-inline mr-2">{{ proj.title }}</h4>
        <span
          class="IssueLabel mr-2"
          :class="
            proj.isDenied
              ? 'bg-red text-white'
              : proj.isExecuting
              ? 'bg-pink text-white'
              : proj.isAwaitingApproval
              ? 'bg-yellow text-gray-dark'
              : proj.isCancelled
              ? 'bg-red text-white'
              : proj.isFinished
              ? 'bg-green text-white'
              : ''
          "
          >🚦 {{ proj.state }}</span
        >
        <p class="f6 mx-2 float-right">
          {{ proj.startDate.toLocaleDateString() }} -
          {{ proj.endDate.toLocaleDateString() }}
        </p>
        <span class="Label float-right">🗝️ {{ proj.pId }}</span>
        <p class="note">
          Priority: {{ proj.priority }} | Lead: {{ proj.projectLead.fullName }} | Model: {{ proj.model.title }}
        </p>

        <div v-if="!proj.isAwaitingApproval && !proj.isDenied">
          <p class="note">Progress {{ proj.progress.toFixed(2) }}%</p>
          <span class="Progress Progress--small">
            <span class="Progress-item bg-green" :style="{ width: proj.progress + '%' }"> </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { Project } from "@/classes/project";

export default defineComponent({
  name: "ListProject",
  emits: ["clickedProject"],
  setup(props, { emit }) {
    const store = useStore();

    const projects: ComputedRef<Array<Project>> = computed(() => store.getters.sortedProjects);

    const informClicked = (project: Project) => emit("clickedProject", project);

    return {
      projects,
      informClicked,
    };
  },
});
</script>

<style lang="scss">
.clickable {
  cursor: pointer;
}
</style>