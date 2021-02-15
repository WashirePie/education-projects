<template>

  <!-- Title -->
  <div class="container-lg mt-5 px-lg-5">
    <div class="Subhead hx_Subhead--responsive">
      <h1 class="Subhead-heading">
        Plan your new Project
        <p class="f5 mt-3 d-block">
          Follow this form through from top to bottom to finish planning this project. <br>
          Once planning is finished, this project will await approval to be executed
        </p>
      </h1>
    </div>

    <!-- Project overview -->
    <p class="f5 d-block">
      Project title is set to <b>{{ projectToBePlanned?.title }}</b> and the id to <b>{{ projectToBePlanned?.id }}</b>. <br>
      <b>{{ projectToBePlanned?.projectLead.name }} {{ projectToBePlanned?.projectLead.lastName }}</b> is assigned as project lead. <br>
      <br>
      This project is based on the <b>'{{ projectToBePlanned?.model.title }}'</b> approach model. <br>
      Project priority is set to <b>'{{ projectToBePlanned?.priority }}'</b>. <br>
      The project description is <i>{{ projectToBePlanned?.description }}</i>.
    </p>

    <!-- Start date item -->
    <div class="TimelineItem TimelineItem--condensed">
      <div class="TimelineItem-badge">
        <PrimerIcon octicon="pin" />
      </div>
      <div class="TimelineItem-body ">
        <p class="f5 text-bold mt-3">Start date</p>
        <p class="f5 d-block">{{ projectToBePlanned.startDate.toLocaleDateString() }}</p>
      </div>
    </div>

    <!-- Phases  -->
    <div
      class="TimelineItem pt-4"
      v-for="phase in projectToBePlanned.phases" :key="phase.title"
    >
      <div 
        class="TimelineItem-badge"
        :class="phase.state == planningState ? 'anim-pulse bg-yellow' : 'text-white bg-green'"
      >
        <PrimerIcon 
          v-if="phase.state == planningState" 
          octicon="alert"
        />
        <PrimerIcon 
          v-else 
          octicon="check"
        />
      </div>
      <div class="TimelineItem-body">

        <p class="f5 d-inline">Phase </p>
        <p class="f5 d-inline text-bold">{{ phase.title }}</p>
        <p class="f6 d-block">{{ phase.startDate.toLocaleDateString() }} - {{ phase.endDate.toLocaleDateString() }}</p>
        <button
          class="btn mt-2 d-block"
          type="button"
          @click="setAsPhaseToBePlanned(phase)"
        >
          <PrimerIcon octicon="pencil" />
          <span class="ml-1">Edit</span>
        </button>

      </div>
    </div>

    <!-- End date item -->
    <div class="TimelineItem TimelineItem--condensed">
      <div class="TimelineItem-badge">
        <PrimerIcon octicon="pin" />
      </div>
      <div class="TimelineItem-body ">
        <p class="f5 text-bold mt-3">Projected end date</p>
        <p class="f5 d-block">{{ projectedEndDate?.toLocaleDateString() }}</p>
      </div>
    </div>

    <!-- Release / discard buttons -->
    <div class="mt-4">
      <button
        class="btn btn-primary mr-2"
        type="button"
        @click="validatePlannedProject"
      >
        <PrimerIcon octicon="download" />
        <span>Release Proposal</span>
      </button>

      <button
        class="btn btn-danger mr-2"
        type="button"
        @click="discardPlannedProject"
      >
        <PrimerIcon octicon="trash" />
        <span>Discard</span>
      </button>
    </div>

  </div>

  <!-- Phase modal -->
  <PrimerModal
    v-if="selectedPhase"
    :displayFooter="true"
    :displayHeader="false"
  >
    <template v-slot:body>
      <div class="container-md">
        <FormPlanPhase 
          ref="formPhase"
          :phaseToBePlanned="selectedPhase"
          :projectStartDate="projectToBePlanned.startDate"
        />
      </div>
    </template>

    <!-- Save / cancel buttons -->
    <template v-slot:footer>
      <div class="container-md">
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="validatePlannedPhase"
        >
          <PrimerIcon octicon="download" />
          <span>Save</span>
        </button>

        <button
          class="btn btn-danger mr-2"
          type="button"
          @click="selectedPhase = null"
        >
          <PrimerIcon octicon="trash" />
          <span>Cancel</span>
        </button>
      </div>

    </template>

  </PrimerModal>

</template>

<script lang="ts">
import FormPlanPhase from './FormPlanPhase.vue'
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import PrimerLabel from '@/components/PrimerLabel.vue'
import PrimerIcon from '@/components/PrimerIcon.vue'
import router from '@/router'
import { computed, ComputedRef, defineComponent, getCurrentInstance, Ref, ref } from "vue";
import { useStore } from '@/store';
import { EProjectState, Project } from '@/interfaces/project';
import { ActionTypes } from '@/store/actions'
import { Phase } from '@/interfaces/phase';
import { EValidationTypes } from '@/helpers/validators'

export default defineComponent({
  name: 'Planner',
  components: {
    FormPlanPhase,
    PrimerFieldText,
    PrimerLabel,
    PrimerIcon,
  },
  setup()
  {
    const store = useStore()
    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar
    const planningState = EProjectState.PLANNING

    // Setup references for elements
    const startDateField = ref<Ref | null>(null)
    const formPhase      = ref<Ref | null>(null)

    const selectedPhase  = ref<Phase | null>(null)

    const projectToBePlanned: ComputedRef<Project> = computed(() => store.state.projectToBePlanned! )

    const projectedEndDate: ComputedRef<Date | undefined> = computed(() => projectToBePlanned.value?.phases.reduce((a, c) => a.endDate > c.endDate ? a : c).endDate )

    const validatePlannedProject = (): Promise<string> =>
    {
      return new Promise<string>((resolve, reject) =>
      {
        const startDate         = startDateField.value.validateInput(EValidationTypes.textDateValidation, null)
        const phasesArePlanned  = projectToBePlanned.value!.phases.every(p => p.state == EProjectState.WAITING)

        if (startDate && phasesArePlanned)
        {
          projectToBePlanned!.value!.startDate = startDate
          projectToBePlanned!.value!.state = EProjectState.WAITING
          // COMBAK
          // store.dispatch(ActionTypes.storeEmployee, newEmployee)
          //   .then((res: string) => resolve(res))
          //   .catch((err: string) => reject(err))
        }
        else reject(new Error('Not valid'))
      })
    }

    const discardPlannedProject = () =>
    {
      router.push('/')
      store.dispatch(ActionTypes.setProjectToBePlanned, null)
    }

    const setAsPhaseToBePlanned = (phase: Phase) =>
    {
      selectedPhase.value = phase
    }

    const validatePlannedPhase = () =>
    {
      loadingbar.start()
      
      formPhase.value.validateForm()
        .then((res: Phase) => 
        {
          selectedPhase.value = null
          // TODO: Store project in vuex?
        })
        .catch((err: string) => console.log(err))
        .finally(() => loadingbar.finish())     
    }

    return {
      validatePlannedProject,
      validatePlannedPhase,
      setAsPhaseToBePlanned,
      discardPlannedProject,
      startDateField,
      formPhase,
      planningState,
      selectedPhase,
      projectToBePlanned,
      projectedEndDate
    }
  }
})
</script>

<style lang="scss">

</style>