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
      <Octicon octicon="plus" />
      <span>Plan a new Project</span>
    </button>

    <!-- Create new approach model button -->
    <button
      class="btn mr-2"
      type="button"
      @click="showNewApproachModelModal = true"
    >
      <Octicon octicon="plus" />
      <span>Create a new approach model</span>
    </button>

    <!-- Create new cost center button -->
    <button
      class="btn mr-2"
      type="button"
      @click="showNewCostTypeModal = true"
    >
      <Octicon octicon="plus" />
      <span>Create a new cost type</span>
    </button>

    <!-- Register a new employee button -->
    <button
      class="btn mr-2"
      type="button"
      @click="showNewEmployeeModal = true"
    >
      <Octicon octicon="plus" />
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
    v-if="showNewProjectModal"
    :show="true"
    @discard="showNewProjectModal = false"
    @done="showNewProjectModal = false"
  />

<!-- New approach model modal  -->
  <ModalFormNewApproachModel
    v-if="showNewApproachModelModal"
    :show="true"
    @discard="showNewApproachModelModal = false"
    @done="showNewApproachModelModal = false"
  />
<!-- New cost center modal -->
  <ModalFormNewCostType
    v-if="showNewCostTypeModal"
    :show="true"
    @discard="showNewCostTypeModal = false"
    @done="showNewCostTypeModal = false"
  />
<!-- New employee modal -->
  <ModalFormNewEmployee
    v-if="showNewEmployeeModal"
    :show="true"
    @discard="showNewEmployeeModal = false"
    @done="showNewEmployeeModal = false"
  />

</template>

<script lang="ts">
import ModalFormNewProject from './ModalFormNewProject.vue'
import ModalFormNewApproachModel from './ModalFormNewApproachModel.vue'
import ModalFormNewCostType from './ModalFormNewCostType.vue'
import ModalFormNewEmployee from './ModalFormNewEmployee.vue'
import WidgetProjects from './WidgetProjects.vue'
import WidgetEmployees from './WidgetEmployees.vue'
import Octicon from '@/components/Octicon.vue'
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
    ModalFormNewCostType,
    ModalFormNewEmployee,
    WidgetProjects,
    WidgetEmployees,
    Octicon,
  },
  setup() 
  {
    const store = useStore()
    const showNewProjectModal       = ref(false)
    const showNewApproachModelModal = ref(false)
    const showNewCostTypeModal      = ref(false)
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
      showNewCostTypeModal,
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
