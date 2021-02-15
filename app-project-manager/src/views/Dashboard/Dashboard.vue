<template>
  <!-- Main container -->
  <div class="container-xl my-5 px-3 px-md-4 px-lg-5">

    <!-- Plan new project button -->
    <button
      class="btn btn-primary mr-2"
      :aria-disabled="projectToBePlanned ? 'true' : 'false'"
      type="button"
      @click="showProjectToBePlannedModal = true"
    >
      <PrimerIcon octicon="plus" />
      <span>Plan a new Project</span>
    </button>

    <!-- Widgets -->
    <hr class="mt-6">
    <WidgetProjects/>
    <hr>
    <WidgetEmployees />
    
  </div>

  <!-- New project modal -->
  <PrimerModal
    v-if="showProjectToBePlannedModal"
    :displayFooter="true"
    :displayHeader="false"
    @close="showProjectToBePlannedModal = false"  
  >
    <template v-slot:body>
      <div class="container-md">
        <FormNewProject
          ref="formProject"
        />
      </div>
    </template>

    <!-- Plan this / cancel buttons -->
    <template v-slot:footer>
      <div class="container-md">
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="validateProjectToBePlanned"
        >
          <PrimerIcon octicon="download" />
          <span>Plan This</span>
        </button>

        <button
          class="btn btn-danger mr-2"
          type="button"
          @click="showProjectToBePlannedModal = false"
        >
          <PrimerIcon octicon="trash" />
          <span>Cancel</span>
        </button>
      </div>

    </template>

  </PrimerModal>

</template>

<script lang="ts">
import FormNewProject from './FormNewProject.vue'
import WidgetProjects from './WidgetProjects.vue'
import WidgetEmployees from './WidgetEmployees.vue'
import PrimerIcon from '@/components/PrimerIcon.vue'
import router from '@/router'
import { computed, ComputedRef, defineComponent, getCurrentInstance, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { RouteLocationRaw } from 'vue-router'
import { Project } from '@/interfaces/project'

export default defineComponent({
  name: 'Dashboard',
  components: {
    FormNewProject,
    WidgetProjects,
    WidgetEmployees,
    PrimerIcon,
  },
  setup() 
  {
    const store = useStore()
    const showProjectToBePlannedModal = ref(false)
    const projectToBePlanned: ComputedRef<Project | null> = computed(() => store.state.projectToBePlanned )

    // Setup references for elements
    const formProject = ref<Ref | null>(null)

    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar

    const validateProjectToBePlanned = () =>
    {
      loadingbar.start()
      
      formProject.value.validateForm()
        .then((res: string) => router.push( <RouteLocationRaw>{ path: '/plan'}))
        .catch((err: string) => console.log(err))
        .finally(() => loadingbar.finish())     
    }

    return { 
      showProjectToBePlannedModal, 
      validateProjectToBePlanned,
      projectToBePlanned,
      formProject
    }
  }
})
</script>

<style lang="scss">
</style>
