<template>

  <h3 class="f3-light my-2">
      All Projects
  </h3>

  <div class="d-flex flex-column">
    <div 
      class="p-3 border rounded-1"
      v-for="proj in projects" :key="proj.id"
    >
      <h4 class="f4 d-inline">
        {{ proj.title }}
      </h4>
      
      <span class="IssueLabel bg-green text-white ml-2 d-inline">
        {{ proj.state.toLowerCase() }}
      </span>

      <div class="d-block"></div>

      <p class="f6 d-inline">
        {{proj.startDate.toLocaleDateString() }} - {{ proj.endDate.toLocaleDateString() }} | model: {{ proj.model.title }} | priority 
      </p>
      <span class="IssueLabel bg-red text-white ml-1 d-inline">
        🔥 {{ proj.priority.toLowerCase() }}
      </span>

      <div class="d-block"></div>
      
      <PersonIcon class="circle d-inline my-1" />
      
      <p class="f5 d-inline ml-2">
        Project lead
      </p>

      <span class="IssueLabel IssueLabel--big bg-blue text-white ml-2 d-inline">
        {{ proj.projectLead.name }} {{ proj.projectLead.lastName }}
      </span>

      <p class="note">
        Progress {{ proj.progress }}%
      </p>
      <span class="Progress Progress--small">
        <span 
          class="Progress-item bg-green" 
          :style="{width: proj.progress + '%'}"
        >
        </span>
      </span>

    </div>
  </div>

</template>

<script lang="ts">
import PersonIcon from '@/components/octicons/PersonIcon.vue'
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { Project } from "@/interfaces/project";

export default defineComponent({
  name: 'PrimerWidgetProjects',
  components: {
    PersonIcon
  },
  setup() 
  {
    const store = useStore()

    const projects: ComputedRef<Array<Project>> = computed(() => store.state.projects )

    return {
      projects
    }
  }
})
</script>

<style>

</style>