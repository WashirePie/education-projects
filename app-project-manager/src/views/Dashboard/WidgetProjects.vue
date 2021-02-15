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
    
      <span class="IssueLabel bg-red text-white ml-1 d-inline">
        🔥 {{ proj.priority.toLowerCase() }}
      </span>

      <span class="IssueLabel IssueLabel--big bg-blue text-white ml-1 d-inline">
        {{ proj.projectLead.name }} {{ proj.projectLead.lastName }}
      </span>

      <span class="IssueLabel IssueLabel--big bg-purple text-white ml-1 d-inline">
        {{ proj.model.title }}
      </span>

      <p class="f6 float-right">
        {{proj.startDate.toLocaleDateString() }} - {{ proj.endDate.toLocaleDateString() }}
      </p>

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
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { Project } from "@/interfaces/project";

export default defineComponent({
  name: 'WidgetProjects',
  components: {
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