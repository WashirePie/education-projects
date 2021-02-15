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
        <PrimerFieldText
          ref="activityTitleField"
          inputName="Title"
          inputDescription="Set the title of this activity"
          placeHolder="Title"
        />

        <PrimerFieldText
          ref="activityStartDateField"
          inputName="Start date"
          inputDescription="Set the start date of this activity"
          :placeHolder="parentPhase.startDate.toLocaleDateString()"
        />

        <PrimerFieldText
          ref="activityEndDateField"
          inputName="End date"
          inputDescription="Set the end date of this activity"
          :placeHolder="parentPhase.endDate.toLocaleDateString()"
        />
        
        <PrimerFieldSelect
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
          <PrimerIcon octicon="plus" />
          <span>Add Activity</span>
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
import PrimerIcon from '@/components/PrimerIcon.vue'
import FieldResources from './FieldResources.vue'
import { Phase } from "@/interfaces/phase";
import { computed, ComputedRef, defineComponent, PropType, Ref, ref } from "vue";
import { EValidationTypes } from '@/helpers/validators';
import { IResource } from '@/interfaces/resource';
import { IPrimerSelectItem } from '@/interfaces/primerField';
import { Employee } from '@/interfaces/employee';
import { useStore } from '@/store';
import { Activity } from '@/interfaces/activity';

export default defineComponent({
  name: 'ModalFormPlanActivity',
  components: {
    PrimerFieldText,
    PrimerFieldSelect,
    PrimerIcon,
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

    const activityTitleField           = ref<Ref | null>(null)
    const activityStartDateField      = ref<Ref | null>(null)
    const activityEndDateField        = ref<Ref | null>(null)
    const activityResponsibilityField = ref<Ref | null>(null)
    const activityResourcesField       = ref<Ref | null>(null)

    const errorMessage  = ref<string>('')

    const availableEmployees: ComputedRef<Array<IPrimerSelectItem>> = computed(() =>
    {    
      const employees: Array<Employee> = store.state.employees
      const mapped: Array<IPrimerSelectItem> = employees.map(e => { return { name: `${e.name} ${e.lastName}`, payload: e } as IPrimerSelectItem })

      return mapped
    })

    const savePlannedActivity = () =>
    {
      
      const title: string               = activityTitleField.value.validateInput(EValidationTypes.textValidation, { minChar: 2, maxChar: 60, regex: 'default'})  
      const startDate: Date             = activityStartDateField.value.validateInput(EValidationTypes.textDateValidation, null)
      const endDate: Date               = activityEndDateField.value.validateInput(EValidationTypes.textDateValidation, null)
      const responsibility: Employee    = activityResponsibilityField.value.validateInput()
      const resources: Array<IResource> = activityResourcesField.value.validateInput(1)

      if (title && startDate && endDate && responsibility && resources)
      {
        if (startDate > endDate)
        {
          activityStartDateField.value.errorMessage = 'Start date must be before end date'
          return
        }
        
        if (startDate < props.parentPhase.startDate)
        {
          activityStartDateField.value.errorMessage = 'Start date cannot be before project start date'
          return
        }

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
        
        props.parentPhase.activities.push(newActivity)
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