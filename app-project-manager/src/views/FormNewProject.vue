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
import { computed, defineComponent, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { PrimerSelectItem } from '@/interfaces/primerField'
import { EProjectPriority, EProjectState, Project } from '@/interfaces/project'
import { ApproachModel } from '@/interfaces/approachModel'
import { ActionTypes } from '@/store/actions'

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
    const priorityField       = ref<Ref | null>(null)
    const descField           = ref<Ref | null>(null)

    const approachModels = computed(() =>
    {
      let models: Array<ApproachModel> = store.state.approachModels
      let mapped: Array<PrimerSelectItem> = models.map(a => 
      {
        return <PrimerSelectItem> { name: a.title, payload: a } 
      })
      return mapped
    })

    const priorities: Array<PrimerSelectItem> = [
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
        const title = titleField.value.validateInput(2, 60)
        const id = idField.value.validateInputCustom(/P[\d]{3}/g)
        const model = approachModelField.value.validateInput()
        const priority = priorityField.value.validateInput()
        const description = descField.value.validateInput(10, 500)

        if (title && id && model && priority && description)
        {
          const newProject = { 
            title, 
            id, 
            model, 
            priority,
            description, 
            state: EProjectState.PLANNING 
          } as Partial<Project>

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
      descField,
      approachModels,
      priorities
    }
  }
})
</script>
