<template>

  <div class="container-lg mt-5 px-lg-5">
    <div class="Subhead hx_Subhead--responsive">
      <h1 class="Subhead-heading ">
        Plan your new Project
      </h1>
    </div>

    <p class="f5 d-block">
      Project title is set to <b>{{ newProject?.title }}</b> and the id to <b>{{ newProject?.id }}</b>. 
      <br>
      <b>{{ newProject?.projectLead.name }} {{ newProject?.projectLead.lastName }}</b> is assigned as project lead. 
      <br>
      <br>
      This project is based on the <b>'{{ newProject?.model.title }}'</b> approach model.
      <br>
      Project priority is set to <b>'{{ newProject?.priority }}'</b>.
      <br>
      The project description is <i>{{ newProject?.description }}</i>.
    </p>

    <div class="TimelineItem TimelineItem--condensed mt-3">
      <div class="TimelineItem-badge">
        <PrimerIcon octicon="pin" />
      </div>
      <div class="TimelineItem-body ">
        <PrimerFieldText
          ref="startDateField"
          inputName="Start date"
          inputDescription="Set the start date for this project"
          :placeHolder="newProject?.startDate.toLocaleDateString()"
        />
      </div>
    </div>

    <div 
      class="TimelineItem pt-4"
      v-for="phase in newProject?.phases" :key="phase.title"
    >
      <div class="TimelineItem-badge bg-yellow anim-pulse">
        <PrimerIcon octicon="alert" />
      </div>
      <div class="TimelineItem-body">

        <p class="f5 d-inline">Phase </p>
        <p class="f5 d-inline text-bold">{{ phase.title }}</p>

        <button
          class="btn mt-2 d-block"
          type="button"
          @click="1"
        >
          <PrimerIcon octicon="pencil" />
          <span class="ml-1">Edit</span>
        </button>

      </div>
    </div>  

    <div class="TimelineItem TimelineItem--condensed">
      <div class="TimelineItem-badge">
        <PrimerIcon octicon="pin" />
      </div>
      <div class="TimelineItem-body ">
        <p class="f5 text-bold mt-3">Projected end date</p>
        <p class="f5 d-block">{{ newProject?.endDate.toLocaleDateString() }}</p>
      </div>
    </div>

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

</template>

<script lang="ts">
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import PrimerLabel from '@/components/PrimerLabel.vue'
import PrimerIcon from '@/components/PrimerIcon.vue'
import router from '@/router'
import { computed, ComputedRef, defineComponent, Ref, ref } from "vue";
import { useStore } from '@/store';
import { EProjectState, Project } from '@/interfaces/project';
import { ActionTypes } from '@/store/actions'

export default defineComponent({
  name: 'Planner',
  components: {
    PrimerFieldText,
    PrimerLabel,
    PrimerIcon,
  },
  setup() 
  {
    const store = useStore()

    const startDateField = ref<Ref | null>(null)

    const newProject: ComputedRef<Project | null> = computed(() => store.state.newProject )

    const validatePlannedProject = (): Promise<string> => 
    {
      return new Promise<string>((resolve, reject) =>
      {
        const startDate = startDateField.value.validateInputDate()

        if (startDate)
        {
          newProject!.value!.startDate = startDate
          newProject!.value!.state = EProjectState.WAITING
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
      store.dispatch(ActionTypes.setNewProject, null)
    }

    return {
      validatePlannedProject,
      discardPlannedProject,
      startDateField,
      newProject
    }
  }
})
</script>

<style lang="scss">

</style>