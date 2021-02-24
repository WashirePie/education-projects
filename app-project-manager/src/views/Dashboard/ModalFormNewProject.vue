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
        <InputFieldText
          ref="titleField"
          inputName="Title"
          placeHolder="Title"
          inputDescription="Set a unique title for your new project"
        />

        <InputFieldText
          ref="idField"
          inputName="Identifier"
          placeHolder="P123"
          inputDescription="Set a unique project identifier starting with 'P' followed by a 3 digit code"
        />

        <InputFieldSelect
          ref="priorityField"
          inputName="Priority"
          inputDescription="Set the project priority"
          placeHolder="Choose a priority"
          :selectOptions="priorities"
        />

        <InputFieldSelect
          ref="approachModelField"
          inputName="Approach Model"
          inputDescription="Select an approach model to scaffold your new project"
          placeHolder="Choose an approach model"
          :selectOptions="approachModels"
        />

        <InputFieldSelect
          ref="projectLeadField"
          inputName="Project Lead"
          inputDescription="Select an employee as project lead"
          placeHolder="Choose a project leader"
          :selectOptions="availableProjectLeads"
        />

        <InputFieldDate
          ref="startDateField"
          inputName="Start date"
          inputDescription="Set the start date for your new project"
          :placeHolder="new Date()"
        />

        <InputFieldTextArea
          ref="descField"
          inputName="Description"
          inputDescription="Enter a description for your new project"
        />
      </div>
    </template>

    <!-- Plan this / cancel buttons -->
    <template v-slot:footer>
      <div class="container-md">
        
        <!-- Error message -->
        <p
          class="note text-red d-block"
          v-if="errorMessage"
        >{{ errorMessage }}</p>

        <!-- 'Save' / 'Discard' buttons -->
        <div class="mt-2">
          <button
            class="btn btn-primary mr-2"
            type="button"
            @click="saveNewProject"
          >
            <Octicon octicon="download" />
            <span>Plan This</span>
          </button>

          <button
            class="btn btn-danger mr-2"
            type="button"
            @click="$emit('discard')"
          >
            <Octicon octicon="trash" />
            <span>Discard</span>
          </button>
        </div>
      </div>

    </template>

  </PrimerModal>
 
</template>

<script lang="ts">
import InputFieldText from '@/components/InputFieldText.vue'
import InputFieldDate from '@/components/InputFieldDate.vue'
import InputFieldSelect, { ISelectItem } from '@/components/InputFieldSelect.vue'
import InputFieldTextArea from '@/components/InputFieldTextArea.vue'
import Octicon from '@/components/Octicon.vue'
import router from '@/router'
import { computed, ComputedRef, defineComponent, getCurrentInstance, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { EProjectPriority, Project } from '@/classes/project'
import { ApproachModel } from '@/classes/approachModel'
import { ActionTypes } from '@/store/actions'
import { Employee } from '@/classes/employee'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'ModalFormNewProject',
  components: {
    InputFieldText,
    InputFieldDate,
    InputFieldSelect,
    InputFieldTextArea,
    Octicon
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
    const store = useStore()
    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar

    const errorMessage = ref<string>('')

    // Setup references for the form fields
    const titleField          = ref<InstanceType<typeof InputFieldText>>()
    const idField             = ref<InstanceType<typeof InputFieldText>>()
    const approachModelField  = ref<InstanceType<typeof InputFieldSelect>>()
    const projectLeadField    = ref<InstanceType<typeof InputFieldSelect>>()
    const priorityField       = ref<InstanceType<typeof InputFieldSelect>>()
    const startDateField      = ref<InstanceType<typeof InputFieldDate>>()
    const descField           = ref<InstanceType<typeof InputFieldTextArea>>()

    const approachModels: ComputedRef<Array<ISelectItem>> = computed(() =>
    {
      const models: Array<ApproachModel> = store.state.approachModels
      const mapped: Array<ISelectItem> = models.map(a => { return { name: a.title, payload: a } as ISelectItem })
      
      return mapped
    })

    const availableProjectLeads: ComputedRef<Array<ISelectItem>> = computed(() =>
    {    
      const projectLeaders: Array<Employee> = store.getters.availableProjectLeads
      const mapped: Array<ISelectItem> = projectLeaders.map(pl => { return { name: pl.fullName, payload: pl } as ISelectItem })

      return mapped
    })

    const priorities: Array<ISelectItem> = [
      { name: EProjectPriority.HIGH,          payload: EProjectPriority.HIGH },
      { name: EProjectPriority.ABOVE_AVERAGE, payload: EProjectPriority.ABOVE_AVERAGE },
      { name: EProjectPriority.NORMAL,        payload: EProjectPriority.NORMAL },
      { name: EProjectPriority.BELOW_AVERAGE, payload: EProjectPriority.BELOW_AVERAGE },
      { name: EProjectPriority.LOW,           payload: EProjectPriority.LOW }
    ]

    const saveNewProject = () =>
    {
      const title       = titleField.value!.validateInput({ minChar: 2, maxChar: 45, regex: 'default' })
      const id          = idField.value!.validateInput({ regex: /^P[\d]{3}$/g })
      const model       = approachModelField.value!.validateInput()
      const projectLead = projectLeadField.value!.validateInput()
      const priority    = priorityField.value!.validateInput()
      const startDate   = startDateField.value!.validateInput({})
      const description = descField.value!.validateInput({ minChar: 10, maxChar: 500, regex: /.*/g })
      
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
          .then((res: string) => 
          {
            emit('done')
            router.push( <RouteLocationRaw>{ path: '/plan'})
            errorMessage.value = ''
          })
          .catch((err: Error) => errorMessage.value = err.message)
          .finally(() => loadingbar.finish())     
      }
    }

    return {
      errorMessage,
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
