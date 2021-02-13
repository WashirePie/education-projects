<template>
  <div class="container-xl my-5 px-3 px-md-4 px-lg-5">
    <button
      class="btn btn-primary mr-2"
      :aria-disabled="newProject ? 'true' : 'false'"
      type="button"
      @click="showNewProjectModal = true"
    >
      <PrimerIcon octicon="plus" />
      <span>Plan a new Project</span>
    </button>

    <hr class="mt-6">
    <PrimerWidgetProjects/>
    <hr>
    <PrimerWidgetEmployees />
    
  </div>

  <PrimerModal
    v-if="showNewProjectModal"
    :displayFooter="true"
    :displayHeader="false"
    @close="showNewProjectModal = false"  
  >
    <template v-slot:body>
      <div class="container-md">
        <FormNewProject
          ref="formProject"
        />
      </div>
    </template>

    <template v-slot:footer>
      <div class="container-md">
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="validateNewProject"
        >
          <PrimerIcon octicon="download" />
          <span>Plan This</span>
        </button>

        <button
          class="btn btn-danger mr-2"
          type="button"
          @click="showNewProjectModal = false"
        >
          <PrimerIcon octicon="trash" />
          <span>Cancel</span>
        </button>
      </div>

    </template>

  </PrimerModal>

</template>

<script lang="ts">
import FormNewProject from '@/views/FormNewProject.vue'
import PrimerWidgetProjects from '@/components/PrimerWidgetProjects.vue'
import PrimerWidgetEmployees from '@/components/PrimerWidgetEmployees.vue'
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
    PrimerWidgetProjects,
    PrimerWidgetEmployees,
    PrimerIcon,
  },
  setup() 
  {
    const store = useStore()
    const showNewProjectModal = ref(false)
    const newProject: ComputedRef<Project | null> = computed(() => store.state.newProject )

    // Setup references for the form components
    const formProject = ref<Ref | null>(null)

    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar

    const validateNewProject = () =>
    {
      loadingbar.start()
      
      formProject.value.validateForm()
        .then((res: string) => router.push( <RouteLocationRaw>{ path: '/plan'}))
        .catch((err: string) => console.log(err))
        .finally(() => loadingbar.finish())     
    }

    return { 
      showNewProjectModal, 
      validateNewProject,
      newProject,
      formProject
    }
  }
})
</script>

<style lang="scss">
</style>
