<template>
  <div class="container-xl my-5 px-3 px-md-4 px-lg-5">
    <button
      class="btn btn-primary mr-2"
      type="button"
      @click="showNewProjectModal = true"
    >Plan a new Project</button>

    <hr>

    <PrimerWidgetProjects/>
    
    <hr>
    
    <PrimerWidgetEmployees />
    
  </div>

  <PrimerModal
    v-if="showNewProjectModal"
    :displayFooter="true"
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
        >Create</button>
      </div>
    </template>

  </PrimerModal>

</template>

<script lang="ts">
import FormNewProject from '@/views/FormNewProject.vue'
import PrimerWidgetProjects from '@/components/PrimerWidgetProjects.vue'
import PrimerWidgetEmployees from '@/components/PrimerWidgetEmployees.vue'
import { defineComponent, getCurrentInstance, Ref, ref } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Dashboard',
  components: {
    FormNewProject,
    PrimerWidgetProjects,
    PrimerWidgetEmployees
  },
  setup() 
  {
    const store = useStore()
    const showNewProjectModal = ref(false)

    // Setup references for the form components
    const formProject = ref<Ref | null>(null)

    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar

    const validateNewProject = () =>
    {
      loadingbar.start()
      
      formProject.value.validateForm()
        .then((res: string) => console.log(res))
        .catch((err: string) => console.log(err))
        .finally(() => loadingbar.finish())     
    }

    return { 
      showNewProjectModal, 
      validateNewProject,
      formProject
    }
  }
})
</script>

<style lang="scss">
</style>
