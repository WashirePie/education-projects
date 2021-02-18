<template>

  <!-- Add activity modal -->
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
            Add Activity
          </h1>
        </div>

        <!-- Form components -->
        <InputFieldText
          ref="activityTitleField"
          inputName="Title"
          inputDescription="Set the title of this activity"
          placeHolder="Title"
        />

        <InputFieldDate
          ref="activityStartDateField"
          inputName="Start date"
          inputDescription="Set the start date of this activity"
          :placeHolder="parentPhase.startDate"
        />

        <InputFieldDate
          ref="activityEndDateField"
          inputName="End date"
          inputDescription="Set the end date of this activity"
          :placeHolder="parentPhase.endDate"
        />
        
        <InputFieldSelect
          ref="activityResponsibilityField"
          inputName="Responibility"
          inputDescription="Assign an employee who is responsible for this activity"
          :selectOptions="availableEmployees"
        />

        <FieldResources 
          ref="activityResourcesField"
          inputName="Resources"
          inputDescription="Plan resources for this activity"
        />
      </div>
    </template>

    <!-- Save / cancel buttons -->
    <template v-slot:footer>
      <div class="container-md">
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="savePlannedActivity"
        >
          <Octicon octicon="plus" />
          <span>Add Activity</span>
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

    </template>

  </PrimerModal>

</template>

<script lang="ts">
import InputFieldText from '@/components/InputFieldText.vue'
import InputFieldDate from '@/components/InputFieldDate.vue'
import InputFieldSelect, { ISelectItem } from '@/components/InputFieldSelect.vue'
import Octicon from '@/components/Octicon.vue'
import FieldResources from './FieldResources.vue'
import { Phase } from "@/interfaces/phase";
import { computed, ComputedRef, defineComponent, PropType, Ref, ref } from "vue";
import { Employee } from '@/interfaces/employee';
import { useStore } from '@/store';
import { Activity } from '@/interfaces/activity';

export default defineComponent({
  name: 'ModalFormPlanActivity',
  components: {
    InputFieldText,
    InputFieldDate,
    InputFieldSelect,
    Octicon,
    FieldResources
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    parentPhase: {
      type: Object as PropType<Phase>,
      required: true
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['discard', 'done'],
  setup(props, { emit }) 
  {
    const store = useStore()

    const activityTitleField          = ref<InstanceType<typeof InputFieldText>>()
    const activityStartDateField      = ref<InstanceType<typeof InputFieldDate>>()
    const activityEndDateField        = ref<InstanceType<typeof InputFieldDate>>()
    const activityResponsibilityField = ref<InstanceType<typeof InputFieldSelect>>()
    const activityResourcesField      = ref<InstanceType<typeof FieldResources>>()

    const errorMessage  = ref<string>('')

    const availableEmployees: ComputedRef<Array<ISelectItem>> = computed(() =>
    {    
      const employees: Array<Employee> = store.state.employees
      const mapped: Array<ISelectItem> = employees.map(e => { return { name: `${e.name} ${e.lastName}`, payload: e } as ISelectItem })

      return mapped
    })

    const savePlannedActivity = () =>
    {
      
      const title          = activityTitleField.value!.validateInput({ minChar: 2, maxChar: 60, regex: 'default'})  
      const startDate      = activityStartDateField.value!.validateInput({ minDate: props.parentPhase.startDate })
      const endDate        = activityEndDateField.value!.validateInput({ minDate: startDate})
      const responsibility = activityResponsibilityField.value!.validateInput()
      const resources      = activityResourcesField.value!.validateInput(1)

      if (title && startDate && endDate && responsibility && resources)
      {
        if (!resources.length)
        {
          errorMessage.value = 'An activity needs at least one resource assigned'
          return
        }

        const newId = props.parentPhase.activities.length.toString()
        const newActivity = new Activity(
          newId, 
          title,
          startDate,
          endDate,
          resources,
          responsibility
        )
        
        props.parentPhase.addActivity(newActivity)
        emit('done')
      }
    }

    return {
      errorMessage,
      activityTitleField,
      activityStartDateField,
      activityEndDateField,
      activityResponsibilityField,
      activityResourcesField,
      availableEmployees,
      savePlannedActivity
    }
  }
})
</script>