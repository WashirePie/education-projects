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
    <button class="btn mr-2" type="button" @click="showNewApproachModelModal = true">
      <Octicon octicon="plus" />
      <span>Create a new approach model</span>
    </button>

    <!-- Create new cost center button -->
    <button class="btn mr-2" type="button" @click="showNewCostTypeModal = true">
      <Octicon octicon="plus" />
      <span>Create a new cost type</span>
    </button>

    <!-- Register a new employee button -->
    <button class="btn mr-2" type="button" @click="showNewEmployeeModal = true">
      <Octicon octicon="plus" />
      <span>Register a new employee</span>
    </button>

    <!-- Widgets -->
    <hr class="mt-6" />
    <ListProjects @clickedProject="handleProjectAction" />
    <br />
    <ListApproachModels @removeApproachModel="removeApproachModel" />
    <br />
    <ListEmployees @removeEmployee="removeEmployee" />
    <br />
    <ListCostTypes @removeCostType="removeCostType" />
  </div>

  <!-- New project modal -->
  <ModalFormNewProject
    v-if="showNewProjectModal"
    :show="true && !projectToBePlanned"
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
import ModalFormNewProject from "./ModalFormNewProject.vue";
import ModalFormNewApproachModel from "./ModalFormNewApproachModel.vue";
import ModalFormNewCostType from "./ModalFormNewCostType.vue";
import ModalFormNewEmployee from "./ModalFormNewEmployee.vue";
import ListProjects from "./ListProjects.vue";
import ListEmployees from "./ListEmployees.vue";
import ListApproachModels from "./ListApproachModels.vue";
import ListCostTypes from "./ListCostTypes.vue";
import Octicon from "@/components/Octicon.vue";
import router from "@/router";
import { computed, ComputedRef, defineComponent, getCurrentInstance, Ref, ref } from "vue";
import { useStore } from "@/store";
import { RouteLocationRaw } from "vue-router";
import { Project } from "@/classes/project";
import { ActionTypes } from "@/store/actions";
import { ApproachModel } from "@/classes/approachModel";
import { CostType } from "@/classes/costType";
import { Employee } from "@/classes/employee";

export default defineComponent({
  name: "Dashboard",
  components: {
    ModalFormNewProject,
    ModalFormNewApproachModel,
    ModalFormNewCostType,
    ModalFormNewEmployee,
    ListProjects,
    ListEmployees,
    ListApproachModels,
    ListCostTypes,
    Octicon,
  },
  setup() {
    const store = useStore();
    const showNewProjectModal = ref(false);
    const showNewApproachModelModal = ref(false);
    const showNewCostTypeModal = ref(false);
    const showNewEmployeeModal = ref(false);
    const projectToBePlanned: ComputedRef<Project | null> = computed(() => store.state.projectToBePlanned);

    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar;

    const removeApproachModel = (model: ApproachModel) => store.dispatch(ActionTypes.deleteApproachModel, model);
    const removeCostType = (costType: CostType) => store.dispatch(ActionTypes.deleteCostType, costType);
    const removeEmployee = (employee: Employee) => store.dispatch(ActionTypes.deleteEmployee, employee);

    const handleProjectAction = async (project: Project) => {
      if (project.isAwaitingApproval) {
        await project.approve();

        loadingbar.start();

        store
          .dispatch(ActionTypes.storeProject, project)
          .catch((error: Error) =>
            window.dialog.showErrorBox("An error occured while updating this project", error.message)
          )
          .finally(() => loadingbar.finish());
      } else if (project.isExecuting) {
        loadingbar.start();

        store
          .dispatch(ActionTypes.setProjectToBeManaged, project)
          .then(() => router.push(<RouteLocationRaw>{ path: "/execute" }))
          .catch((err: Error) => window.dialog.showMessageBox({ message: "There's already a project in the manager" }))
          .finally(() => loadingbar.finish());
      } else if (project.isFinished) {
        // Ignore
      }
    };

    return {
      showNewProjectModal,
      showNewApproachModelModal,
      showNewCostTypeModal,
      showNewEmployeeModal,
      handleProjectAction,
      projectToBePlanned,
      removeApproachModel,
      removeCostType,
      removeEmployee,
    };
  },
});
</script>

