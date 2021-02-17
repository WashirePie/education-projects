<template>

  <!-- New project modal -->
  <PrimerModal
    v-if="show"
    :displayFooter="true"
    :displayHeader="false"
  >
    <template v-slot:body>
      <div class="container-md">
        <!-- Title -->
        <div class="Subhead hx_Subhead--responsive mb-5">
          <h1 class="Subhead-heading ">
            Create a new project
          </h1>
        </div>

        <!-- Form components -->
        <PrimerFieldText
          ref="titleField"
          inputName="Title"
          placeHolder="Title"
          inputDescription="Set a unique title for your new project"
        />

        <PrimerFieldText
          ref="idField"
          inputName="Identifier"
          placeHolder="P123"
          inputDescription="Set a unique project identifier starting with 'P' followed by a 3 digit code"
        />

        <PrimerFieldSelect
          ref="priorityField"
          inputName="Priority"
          inputDescription="Set the project priority"
          placeHolder="Choose a priority"
          :selectOptions="priorities"
        />

        <PrimerFieldSelect
          ref="approachModelField"
          inputName="Approach Model"
          inputDescription="Select an approach model to scaffold your new project"
          placeHolder="Choose an approach model"
          :selectOptions="approachModels"
        />

        <PrimerFieldSelect
          ref="projectLeadField"
          inputName="Project Lead"
          inputDescription="Select an employee as project lead"
          placeHolder="Choose a project leader"
          :selectOptions="availableProjectLeads"
        />

        <PrimerFieldText
          ref="startDateField"
          inputName="Start date"
          inputDescription="Set the start date for your new project"
          :placeHolder="new Date().toLocaleDateString()"
        />

        <PrimerFieldTextArea
          ref="descField"
          inputName="Description"
          inputDescription="Enter a description for your new project"
        />
      </div>
    </template>

    <!-- Plan this / cancel buttons -->
    <template v-slot:footer>
      <div class="container-md">
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="saveNewProject"
        >
          <PrimerIcon octicon="download" />
          <span>Plan This</span>
        </button>

        <button
          class="btn btn-danger mr-2"
          type="button"
          @click="$emit('discard')"
        >
          <PrimerIcon octicon="trash" />
          <span>Discard</span>
        </button>
      </div>

    </template>

  </PrimerModal>
 
</template>

<script lang="ts">
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import PrimerFieldSelect from '@/components/PrimerFieldSelect.vue'
import PrimerFieldTextArea from '@/components/PrimerFieldTextArea.vue'
import PrimerIcon from '@/components/PrimerIcon.vue'
import router from '@/router'
import { computed, ComputedRef, defineComponent, getCurrentInstance, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { IPrimerSelectItem } from '@/interfaces/primerField'
import { EProjectPriority, Project } from '@/interfaces/project'
import { ApproachModel } from '@/interfaces/approachModel'
import { ActionTypes } from '@/store/actions'
import { Employee } from '@/interfaces/employee'
import { EValidationTypes } from '@/helpers/validators'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'ModalFormNewProject',
  components: {
    PrimerFieldText,
    PrimerFieldSelect,
    PrimerFieldTextArea,
    PrimerIcon
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['discard', 'done'],
  setup (props, { emit })
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()
    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar

    // Setup references for the form fields
    const titleField          = ref<Ref | null>(null)
    const idField             = ref<Ref | null>(null)
    const approachModelField  = ref<Ref | null>(null)
    const projectLeadField    = ref<Ref | null>(null)
    const priorityField       = ref<Ref | null>(null)
    const startDateField      = ref<Ref | null>(null)
    const descField           = ref<Ref | null>(null)

    const approachModels: ComputedRef<Array<IPrimerSelectItem>> = computed(() =>
    {
      const models: Array<ApproachModel> = store.state.approachModels
      const mapped: Array<IPrimerSelectItem> = models.map(a => { return { name: a.title, payload: a } as IPrimerSelectItem })
      
      return mapped
    })

    const availableProjectLeads: ComputedRef<Array<IPrimerSelectItem>> = computed(() =>
    {    
      const projectLeaders: Array<Employee> = store.getters.availableProjectLeads
      const mapped: Array<IPrimerSelectItem> = projectLeaders.map(pl => { return { name: `${pl.name} ${pl.lastName}`, payload: pl } as IPrimerSelectItem })

      return mapped
    })

    const priorities: Array<IPrimerSelectItem> = [
      { name: EProjectPriority.HIGH,          payload: EProjectPriority.HIGH },
      { name: EProjectPriority.ABOVE_AVERAGE, payload: EProjectPriority.ABOVE_AVERAGE },
      { name: EProjectPriority.NORMAL,        payload: EProjectPriority.NORMAL },
      { name: EProjectPriority.BELOW_AVERAGE, payload: EProjectPriority.BELOW_AVERAGE },
      { name: EProjectPriority.LOW,           payload: EProjectPriority.LOW }
    ]

    const saveNewProject = () =>
    {
      const title: string               = titleField.value.validateInput(EValidationTypes.textValidation, { minChar: 2, maxChar: 60, regex: 'default' })
      const id: string                  = idField.value.validateInput(EValidationTypes.textValidation, { regex: /^P[\d]{3}$/g })
      const model: ApproachModel        = approachModelField.value.validateInput()
      const projectLead: Employee       = projectLeadField.value.validateInput()
      const priority: EProjectPriority  = priorityField.value.validateInput()
      const startDate: Date             = startDateField.value.validateInput(EValidationTypes.textDateValidation, null)
      const description: string         = descField.value.validateInput(EValidationTypes.textValidation, { minChar: 10, maxChar: 500, regex: /.*/g })

      if (title && id && model && projectLead && priority && startDate && description)
      {
        const newProject: Project = new Project(
          title, 
          id, 
          model, 
          description, 
          startDate, 
          priority, 
          projectLead 
        )

        loadingbar.start()

        store.dispatch(ActionTypes.setProjectToBePlanned, newProject)
          .then((res: string) => router.push( <RouteLocationRaw>{ path: '/plan'}))
          .catch((err: string) => console.log(err))
          .finally(() => 
          {
            loadingbar.finish()
            emit('done')
          })     
      }
    }

    return {
      saveNewProject,
      titleField,
      idField,
      approachModelField,
      priorityField,
      projectLeadField,
      startDateField,
      descField,
      approachModels,
      availableProjectLeads,
      priorities
    }
  }
})
</script>