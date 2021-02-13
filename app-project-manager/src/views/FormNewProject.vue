<template>
  <div class="Subhead hx_Subhead--responsive mb-5">
    <h1 class="Subhead-heading ">
      Create a new project
    </h1>
  </div>

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

  <PrimerFieldTextArea
    ref="descField"
    inputName="Description"
    inputDescription="Enter a description for your new project"
  />
</template>

<script lang="ts">
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import PrimerFieldSelect from '@/components/PrimerFieldSelect.vue'
import PrimerFieldTextArea from '@/components/PrimerFieldTextArea.vue'
import { computed, ComputedRef, defineComponent, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { IPrimerSelectItem } from '@/interfaces/primerField'
import { EProjectPriority, Project } from '@/interfaces/project'
import { ApproachModel } from '@/interfaces/approachModel'
import { ActionTypes } from '@/store/actions'
import { EEmployeeFunctions, Employee, IEmployeeFunction } from '@/interfaces/employee'

export default defineComponent({
  name: 'FormNewProject',
  components: {
    PrimerFieldText,
    PrimerFieldSelect,
    PrimerFieldTextArea
  },
  setup ()
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()

    // Setup references for the form fields
    const titleField          = ref<Ref | null>(null)
    const idField             = ref<Ref | null>(null)
    const approachModelField  = ref<Ref | null>(null)
    const projectLeadField    = ref<Ref | null>(null)
    const priorityField       = ref<Ref | null>(null)
    const descField           = ref<Ref | null>(null)

    const approachModels: ComputedRef<Array<IPrimerSelectItem>> = computed(() =>
    {
      const models: Array<ApproachModel> = store.state.approachModels
      const mapped: Array<IPrimerSelectItem> = models.map(a => <IPrimerSelectItem> { name: a.title, payload: a })
      
      return mapped
    })

    const availableProjectLeads: ComputedRef<Array<IPrimerSelectItem>> = computed(() =>
    {    
      const projectLeaders: Array<Employee> = 
        store.state.employees.filter(e => 
          e.possibleFunctions.some(f => f.name == EEmployeeFunctions.ProjectLead))
      const mapped: Array<IPrimerSelectItem> = projectLeaders.map(pl => <IPrimerSelectItem> { name: `${pl.name} ${pl.lastName}`, payload: pl })

      return mapped
    })

    const priorities: Array<IPrimerSelectItem> = [
      { name: EProjectPriority.HIGH,          payload: EProjectPriority.HIGH },
      { name: EProjectPriority.ABOVE_AVERAGE, payload: EProjectPriority.ABOVE_AVERAGE },
      { name: EProjectPriority.NORMAL,        payload: EProjectPriority.NORMAL },
      { name: EProjectPriority.BELOW_AVERAGE, payload: EProjectPriority.BELOW_AVERAGE },
      { name: EProjectPriority.LOW,           payload: EProjectPriority.LOW }
    ]

    const validateForm = (): Promise<string> =>
    {
      return new Promise<string>((resolve, reject) =>
      {
        const title: string               = titleField.value.validateInput(2, 60)
        const id: string                  = idField.value.validateInputCustom(/^P[\d]{3}$/g)
        const model: ApproachModel        = approachModelField.value.validateInput()
        const projectLead: Employee       = projectLeadField.value.validateInput()
        const priority: EProjectPriority  = priorityField.value.validateInput()
        const description: string         = descField.value.validateInput(10, 500)

        if (title && id && model && projectLead && priority && description)
        {
          const newProject: Project = new Project(title, id, model, description, new Date(), priority, projectLead )

          store.dispatch(ActionTypes.setNewProject, newProject)
            .then((res: string) => resolve(res))
            .catch((err: string) => reject(err))
        }
        else reject(new Error('Not valid'))        
      })
    }

    return {
      validateForm,
      titleField,
      idField,
      approachModelField,
      priorityField,
      projectLeadField,
      descField,
      approachModels,
      availableProjectLeads,
      priorities
    }
  }
})
</script>
