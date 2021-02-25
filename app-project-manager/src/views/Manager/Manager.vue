<template>

  <!-- Title -->
  <div class="container-lg mt-5 px-lg-5">
    <div class="Subhead hx_Subhead--responsive">
      <h1 class="Subhead-heading">
        Manage active Project <b>'{{ projectToBeManaged.title }}'</b>
      </h1>
    </div>

    <!-- Project overview -->
    <p class="f3 mt-5">Project Overview</p>
    <p class="f5 d-block">
      Project title is set to <b>{{ projectToBeManaged?.title }}</b> and the id to <b>{{ projectToBeManaged?.id }}</b>. <br>
      <b>{{ projectToBeManaged?.projectLead.fullName }}</b> is assigned as project lead. <br>
      <br>
      This project is based on the <b>'{{ projectToBeManaged?.model.title }}'</b> approach model. <br>
      Project priority is set to <b>'{{ projectToBeManaged?.priority }}'</b>. <br>
      The project description is <i>{{ projectToBeManaged?.description }}</i>.
    </p>


    <!-- Add Project docs button -->
    <p class="f3 mt-5">Project Documents</p>
    <hr>
    
    <button
      class="btn ml-2"
      type="button"
      @click="projectToBeManaged.addDocuments()"
    >
      <Octicon octicon="plus" />
      <span>Add Documents</span>
    </button>

    <ListDocuments
      :documents="projectToBeManaged.documents"
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
        <p class="f5 d-block">{{ projectToBeManaged.startDate.toLocaleDateString() }}</p>
      </div>
    </div>

    <!-- Phases timeline  -->
    <div
      class="TimelineItem pt-4"
      v-for="phase in projectToBeManaged.phases" :key="phase.title"
    >
      <div 
        class="TimelineItem-badge"
        :class="phase.isPlanned ? 'text-white bg-green' : 'bg-yellow'"
      >
        <!-- Phase state icon -->
        <Octicon 
          v-if="!phase.isPlanned" 
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
        <p class="f6 float-right">📅 {{ phase.startDate.toLocaleDateString() }} - {{ phase.endDate.toLocaleDateString() }}</p>
        <p class="note">
          Progress {{ phase.progress.toFixed(2) }}%
        </p>
        <MilestoneProgress
          class="mt-2"
          :milestone="phase.phaseMilestone"
          :phase="phase"
        />
        <!-- <span class="Progress Progress--small">
          <span 
            class="Progress-item bg-green" 
            :style="{width: phase.progress + '%'}"
          >
          </span>
        </span> -->

        <!-- Phase form -->
        <details class="details-reset mt-3">
          <summary class="btn">Manage</summary>
          <div class="border p-3 mt-2">
            <FormManagePhase 
              :phase="phase"
              :project="projectToBeManaged"
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
        class="note text-red d-block"
        v-if="errorMessage"
      >{{ errorMessage }}</p>

      <!-- 'Release' / 'discard' buttons -->
      <div class="mt-2">
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="saveProjectToBeManaged"
        >
          <Octicon octicon="download" />
          <span>Save Changes</span>
        </button>

        <button
          class="btn btn-danger mr-2"
          type="button"
          @click="discardProjectToBeManaged"
        >
          <Octicon octicon="trash" />
          <span>Discard Changes</span>
        </button>
      </div>
    </div>

  </div>

</template>

<script lang="ts">
import FormManagePhase from './FormManagePhase.vue'
import InputFieldText from '@/components/InputFieldText.vue'
import ListDocuments from '@/components/ListDocuments.vue'
import MilestoneProgress from './MilestoneProgress.vue'
import Octicon from '@/components/Octicon.vue'
import router from '@/router'
import { computed, ComputedRef, defineComponent, getCurrentInstance, ref } from "vue";
import { useStore } from '@/store';
import { Project } from '@/classes/project';
import { ActionTypes } from '@/store/actions'
import { DocumentRef } from '@/classes/document'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'Planner',
  components: {
    FormManagePhase,
    InputFieldText,
    ListDocuments,
    MilestoneProgress,
    Octicon,
  },
  setup()
  {
    const store = useStore()
    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar

    const errorMessage = ref<string>('')

    const projectToBeManaged: ComputedRef<Project> = computed(() => store.state.projectToBeManaged! )

    const projectedEndDate: ComputedRef<Date> = computed(() => projectToBeManaged.value.endDate )

    const removeDocument = (document: DocumentRef) => projectToBeManaged.value.removeDocument(document)

  const discardProjectToBeManaged = () => 
    {
      router.push( <RouteLocationRaw>{ path: '/'})
      store.dispatch(ActionTypes.setProjectToBeExecuted, null)
    }

    const saveProjectToBeManaged = () =>
    {
      try 
      {
        // TODO: Implement Checks
        store.dispatch(ActionTypes.updateProject, projectToBeManaged.value)
          .then((res: string) => 
          {
            errorMessage.value = ''
            router.push( <RouteLocationRaw>{ path: '/'})
            store.dispatch(ActionTypes.setProjectToBeExecuted, null)
          })
          .catch((err: Error) => errorMessage.value = err.message)
          .finally(() => loadingbar.finish())     
      } 
      catch (error) 
      {
        errorMessage.value = error.message
      }
    }
    
    return {
      saveProjectToBeManaged,
      removeDocument,
      errorMessage,
      discardProjectToBeManaged,
      projectToBeManaged,
      projectedEndDate
    }
  }
})
</script>

<style lang="scss">

</style>