<template>
  <!-- Main container -->
  <div class="container-xl my-5 px-3 px-md-4 px-lg-5">

    <!-- Plan new project button -->
    <button
      class="btn btn-primary mr-2"
      :aria-disabled="projectToBePlanned ? 'true' : 'false'"
      type="button"
      @click="showNewProjectModal = true"
    >
      <PrimerIcon octicon="plus" />
      <span>Plan a new Project</span>
    </button>

    <!-- Create new approach model button -->
    <button
      class="btn mr-2"
      type="button"
      @click="showNewApproachModelModal = true"
    >
      <PrimerIcon octicon="plus" />
      <span>Create a new approach model</span>
    </button>

    <!-- Create new cost center button -->
    <button
      class="btn mr-2"
      type="button"
      @click="showNewCostCenterModal = true"
    >
      <PrimerIcon octicon="plus" />
      <span>Create a new cost center</span>
    </button>

    <!-- Register a new employee button -->
    <button
      class="btn mr-2"
      type="button"
      @click="showNewEmployeeModal = true"
    >
      <PrimerIcon octicon="plus" />
      <span>Register a new employee</span>
    </button>
    <!-- Widgets -->
    <hr class="mt-6">
    <WidgetProjects/>
    <hr>
    <WidgetEmployees />
    
  </div>

  <!-- New project modal -->
  <ModalFormNewProject
    :show="showNewProjectModal"
    @discard="showNewProjectModal = false"
    @done="showNewProjectModal = false"
  />

<!-- New approach model modal  -->
  <ModalFormNewApproachModel
    :show="showNewApproachModelModal"
    @discard="showNewApproachModelModal = false"
    @done="showNewApproachModelModal = false"
  />
<!-- New cost center modal -->
  <ModalFormNewCostCenter
    :show="showNewCostCenterModal"
    @discard="showNewCostCenterModal = false"
    @done="showNewCostCenterModal = false"
  />
<!-- New employee modal -->
  <ModalFormNewEmployee
    :show="showNewEmployeeModal"
    @discard="showNewEmployeeModal = false"
    @done="showNewEmployeeModal = false"
  />

</template>

<script lang="ts">
import ModalFormNewProject from './ModalFormNewProject.vue'
import ModalFormNewApproachModel from './ModalFormNewApproachModel.vue'
import ModalFormNewCostCenter from './ModalFormNewCostCenter.vue'
import ModalFormNewEmployee from './ModalFormNewEmployee.vue'
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
    ModalFormNewProject,
    ModalFormNewApproachModel,
    ModalFormNewCostCenter,
    ModalFormNewEmployee,
    WidgetProjects,
    WidgetEmployees,
    PrimerIcon,
  },
  setup() 
  {
    const store = useStore()
    const showNewProjectModal       = ref(false)
    const showNewApproachModelModal = ref(false)
    const showNewCostCenterModal    = ref(false)
    const showNewEmployeeModal      = ref(false)
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
      showNewProjectModal, 
      showNewApproachModelModal,
      showNewCostCenterModal,
      showNewEmployeeModal,
      validateProjectToBePlanned,
      projectToBePlanned,
      formProject
    }
  }
})
</script>

<style lang="scss">
</style>
