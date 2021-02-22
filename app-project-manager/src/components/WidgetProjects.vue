<template>

  <div v-if="projects.length">

    <h3 class="f3-light my-2">Projects</h3>
    
    <div class="Box mt-2">
      <div
        class="Box-row"
        v-for="proj in projects" :key="proj.id"
      >
        <h4 class="f4 d-inline mr-2">{{ proj.title }}</h4>
        <span class="Label mr-2">🗝️ {{ proj.id }}</span>
        <span class="Counter mr-2">🚦 {{ proj.state }}</span>
        <span class="IssueLabel bg-red text-white mr-2 d-inline">❕ {{ proj.priority }} </span> 
        <span class="IssueLabel bg-blue text-white mr-2 d-inline">🧍 {{ proj.projectLead.fullName }}</span>
        <span class="IssueLabel bg-green text-white mr-2 d-inline">🔗 {{ proj.model.title }} </span> 

        <p class="f6 float-right">{{proj.startDate.toLocaleDateString() }} - {{ proj.endDate.toLocaleDateString() }}</p>

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

  </div>

</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { Project } from "@/classes/project";

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