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
    <p class="f3 mt-5">Project Overview</p>
    <p class="f5 d-block">
      Project title is set to <b>{{ projectToBePlanned?.title }}</b> and the id to <b>{{ projectToBePlanned?.id }}</b>. <br>
      <b>{{ projectToBePlanned?.projectLead.fullName }}</b> is assigned as project lead. <br>
      <br>
      This project is based on the <b>'{{ projectToBePlanned?.model.title }}'</b> approach model. <br>
      Project priority is set to <b>'{{ projectToBePlanned?.priority }}'</b>. <br>
      The project description is <i>{{ projectToBePlanned?.description }}</i>.
    </p>


    <!-- Add Project docs button -->
    <p class="f3 mt-5">Project Documents</p>
    <hr>
    
    <button
      class="btn ml-2"
      type="button"
      @click="projectToBePlanned.addDocuments()"
    >
      <Octicon octicon="plus" />
      <span>Add Documents</span>
    </button>

    <ListDocuments
      :documents="projectToBePlanned.documents"
      @removeDocument="removeDocument"
    />


    <p class="f3 mt-5">Project Phases</p>
    <hr>

    <!-- Start date item -->
    <div class="TimelineItem TimelineItem--condensed">
      <div class="TimelineItem-badge">
        <Octicon octicon="pin" />
      </div>
      <div class="TimelineItem-body ">
        <p class="f5 text-bold mt-3">Start date</p>
        <p class="f5 d-block">{{ projectToBePlanned.startDate.toLocaleDateString() }}</p>
      </div>
    </div>

    <!-- Phases timeline  -->
    <div
      class="TimelineItem pt-4"
      v-for="phase in projectToBePlanned.phases" :key="phase.title"
    >
      <div 
        class="TimelineItem-badge"
        :class="phase.state == planningState ? 'bg-yellow' : 'text-white bg-green'"
      >
        <!-- Phase state icon -->
        <Octicon 
          v-if="phase.state == planningState" 
          octicon="alert"
        />
        <Octicon 
          v-else 
          octicon="check"
        />
      </div>
      <div class="TimelineItem-body">

        <!-- Phase base data -->
        <p class="f5 d-inline">Phase </p>
        <p class="f5 d-inline text-bold">{{ phase.title }}</p>
        <p class="f6 d-block">{{ phase.startDate.toLocaleDateString() }} - {{ phase.endDate.toLocaleDateString() }}</p>

        <!-- Phase form -->
        <details class="details-reset">
          <summary class="btn">Edit</summary>
          <div class="border p-3 mt-2">
            <FormPlanPhase 
              :phase="phase"
              :project="projectToBePlanned"
            />
          </div>
        </details>

      </div>
    </div>

    <!-- End date item -->
    <div class="TimelineItem TimelineItem--condensed">
      <div class="TimelineItem-badge">
        <Octicon octicon="pin" />
      </div>
      <div class="TimelineItem-body ">
        <p class="f5 text-bold mt-3">Projected end date</p>
        <p class="f5 d-block">{{ projectedEndDate?.toLocaleDateString() }}</p>
      </div>
    </div>

    <!-- Release / discard buttons -->
    <div class="mt-4">

      <!-- Error message -->
      <p
        class="note text-red"
        v-if="errorMessage"
      >{{ errorMessage }}</p>

      <button
        class="btn btn-primary mr-2 mt-2"
        type="button"
        @click="savePlannedProject"
      >
        <Octicon octicon="download" />
        <span>Release Proposal</span>
      </button>

      <button
        class="btn btn-danger mr-2"
        type="button"
        @click="discardPlannedProject"
      >
        <Octicon octicon="trash" />
        <span>Discard</span>
      </button>
    </div>

  </div>

</template>

<script lang="ts">
import FormPlanPhase from './FormPlanPhase.vue'
import InputFieldText from '@/components/InputFieldText.vue'
import ListDocuments from '@/components/ListDocuments.vue'
import Label from '@/components/Label.vue'
import Octicon from '@/components/Octicon.vue'
import router from '@/router'
import { computed, ComputedRef, defineComponent, getCurrentInstance, ref } from "vue";
import { useStore } from '@/store';
import { EProjectState, Project } from '@/classes/project';
import { ActionTypes } from '@/store/actions'
import { DocumentRef } from '@/classes/document'

export default defineComponent({
  name: 'Planner',
  components: {
    FormPlanPhase,
    InputFieldText,
    ListDocuments,
    Label,
    Octicon,
  },
  setup()
  {
    const store = useStore()
    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar
    const planningState = EProjectState.PLANNING

    const errorMessage = ref<string>('')

    const projectToBePlanned: ComputedRef<Project> = computed(() => store.state.projectToBePlanned! )

    const projectedEndDate: ComputedRef<Date> = computed(() => projectToBePlanned.value.endDate )

    const removeDocument = (document: DocumentRef) => projectToBePlanned.value.removeDocument(document)

    const savePlannedProject = () =>
    {
      try 
      {
        projectToBePlanned.value.plan()
        console.log(projectToBePlanned.value);
        
        errorMessage.value = ''
      } 
      catch (error) 
      {
        errorMessage.value = error.message
      }
    }

    const discardPlannedProject = () =>
    {
      router.push('/')
      store.dispatch(ActionTypes.setProjectToBePlanned, null)
    }

    return {
      savePlannedProject,
      removeDocument,
      errorMessage,
      discardPlannedProject,
      planningState,
      projectToBePlanned,
      projectedEndDate
    }
  }
})
</script>

<style lang="scss">

</style>