<template>
    <!-- Label & description -->
  <div class="form-group">
    <div class="form-group-header">
      <label
        for="resource-field"
      >{{ inputName }}</label>
    </div>
    <span :class="`text-small`">{{ inputDescription }}</span>
  </div>

  <!-- Input field -->
  <div class="form-group-body">
    <input
      :class="`form-control ${titleErrorMessage ? 'border-red' : ''}`"
      id="resource-field"
      type="text"
      v-model="titleValue"
      placeholder="Title"
    />

    <select
      v-model="resourceTypeValue"
      class="form-select ml-2"
    >
      <option
        v-for="option in resourceTypes" :key="option.name" 
        :value="option.payload"
      >{{ option.name }}</option>
    </select>

    <!-- Fields for personnel resource -->
    <div
      v-if="resourceTypeValue == resourceTypes[0].payload"
      class="mt-2"
    >
      <select
        v-model="employeeFunctionValue"
        class="form-select"
      >
        <option
          v-for="func in employeeFunctions" :key="func.name" 
          :value="func.name"
        >{{ func.name }}</option>
      </select>

      <select
        v-model="availableEmployeeValue"
        class="form-select ml-2"
      >
        <option
          v-for="empl in availableEmployees" :key="empl.id" 
          :value="empl"
        >{{ empl.id}}: {{ empl.name }} {{ empl.lastName }}</option>
      </select>

      <input
        v-model="workloadPlanField"
        :class="`form-control ml-2 ${workloadErrorMessage ? 'border-red' : ''}`"
        type="number"
        placeholder="10.5"
      />

      <p class="f5 d-inline ml-1">Hours</p>

    </div>

    <!-- Fields for external cost resource -->
    <div 
      v-if="resourceTypeValue == resourceTypes[1].payload"
      class="mt-2"
    >
      <select
        v-model="costCenterValue"
        class="form-select"
      >
        <option
          v-for="cc in costCenters" :key="cc.id" 
          :value="cc"
        >
          {{ cc.id }}: {{ cc.title }} 
        </option>
      </select>


      <input
        v-model="costPlanField"
        :class="`form-control ml-2 ${costErrorMessage ? 'border-red' : ''}`"
        type="number"
        placeholder="2500"
      />

      <p class="f5 d-inline ml-1">CHF</p>

    </div>

    <p
      class="note text-red"
      v-if="titleErrorMessage"
    >{{ titleErrorMessage }}</p>

    <p
      class="note text-red"
      v-if="workloadErrorMessage"
    >{{ workloadErrorMessage }}</p>

    <p
      class="note text-red"
      v-if="costErrorMessage"
    >{{ costErrorMessage }}</p>

    <p
      class="note text-red"
      v-if="errorMessage"
    >{{ errorMessage }}</p>

    <button
      class="btn d-block mt-3"
      type="button"
      @click="addResource"
    >
      <PrimerIcon octicon="plus" />
      <span>Add</span>
    </button>
  </div>

  <!-- Personnel resources array -->
  <span 
    v-for="res in resources" :key="res.title"
    class="Label mr-2 mt-3"
    :class="res.assignee != undefined ? 'Label--yellow' : 'Label--pink'"
  >
    {{ res.title }} | {{ res.assignee?.name }} {{ res.assignee?.lastName }} {{ res.costCenter?.title }} | {{ res.plan }} {{ res.assignee != undefined ? 'h' : 'CHF'}}
    <button
      class="btn-octicon"
      type="button"
      @click="removeResource(res)"
    >
      <PrimerIcon octicon="x" />
    </button>
  </span>

</template>

<script lang="ts">
import PrimerIcon from '@/components/PrimerIcon.vue'
import { EValidationTypes, useValidation } from '@/helpers/validators';
import { CostCenter } from "@/interfaces/costCenter";
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "@/interfaces/employee";
import { IPrimerSelectItem } from "@/interfaces/primerField";
import { EResourceTypes, ExternalCostResource, IResource, PersonnelResource } from "@/interfaces/resource";
import { useStore } from "@/store";
import { computed, ComputedRef, defineComponent, onMounted, ref, watch } from "vue";

export default defineComponent({
  name: 'FieldResources',
  components: {
    PrimerIcon
  },
  props: {
    inputName: {
      type: String,
      default: 'Resources',
    },
    inputDescription: {
      type: String,
      default: ''
    }
  },
  setup(props) 
  {
    const store = useStore()
    const validate = useValidation()

    const titleErrorMessage     = ref<string>('')
    const titleValue            = ref<string>('')
    const resourceTypeValue     = ref<EResourceTypes>()
    const errorMessage          = ref<string>('')

    // Refs for type personal resource
    const employeeFunctionValue = ref<EEmployeeFunctions>()
    const employeeFunctions: ComputedRef<Array<IEmployeeFunction>> = computed(() => store.state.employeeFunctions.filter(f => f.name != EEmployeeFunctions.ProjectLead))
    const availableEmployeeValue = ref<Employee>()
    const availableEmployees: ComputedRef<Array<Employee>> = computed(() => store.state.employees.filter(e => e.possibleFunctions.some(f => f.name == employeeFunctionValue.value)) )
    const workloadPlanField = ref<number>()
    const workloadErrorMessage = ref<string>('')

    // Refs for type external cost
    const costCenterValue = ref<CostCenter>()
    const costCenters: ComputedRef<Array<CostCenter>> = computed(() => store.state.costCenters )
    const costPlanField = ref<number>()
    const costErrorMessage = ref<string>('')

    const resources = ref<Array<PersonnelResource | ExternalCostResource>>([])

    const resourceTypes     = <Array<IPrimerSelectItem>>([
      { name: 'Personnel',     payload: EResourceTypes.personnel },
      { name: 'External Cost', payload: EResourceTypes.externalCost }
    ]) 

    onMounted(() =>
    {
      // Set default values on mounted
      costCenterValue.value = costCenters.value[0]
      employeeFunctionValue.value = EEmployeeFunctions.Developer
      resourceTypeValue.value = EResourceTypes.externalCost
    })

    // Set a default employee when the employee function type changes
    watch(employeeFunctionValue, () => availableEmployeeValue.value = availableEmployees.value[0] )

    // Reset Error messages when typing continues
    watch(workloadPlanField, () => workloadErrorMessage.value = '')
    watch(costPlanField, () => costErrorMessage.value = "")

    const addResource = () =>
    {
      errorMessage.value = ''
      
      const titleValidation = validate(
        EValidationTypes.textValidation, 
        { sourceName: 'Title', source: titleValue.value }, 
        { minChar: 2, maxChar: 60, regex: 'default', duplicatesArray: [...resources.value.map(r => r.title)] }
      )
      
      if(titleValidation.responseMessage)
      {
        titleErrorMessage.value = titleValidation.responseMessage
        return
      }
      else 
        titleErrorMessage.value = ""

      // External cost resource was selected
      if (resourceTypeValue.value == EResourceTypes.externalCost)
      {
        const costValidation = validate(EValidationTypes.textValidation, { sourceName: 'Cost', source: costPlanField.value?.toString()! }, { regex: /^[\d]{1,7}(\.[\d]{1,2})?$/g})
        
        if (costValidation.responseMessage)
        {
          costErrorMessage.value = costValidation.responseMessage
          return
        }

        const newExternalCostResource = new ExternalCostResource(
          titleValidation.payload!, 
          parseFloat(costValidation.payload!),
          costCenterValue.value!
        )

        resources.value.push(newExternalCostResource)
      }
      // Personnel resource was selected
      else if (resourceTypeValue.value == EResourceTypes.personnel)
      {
        const workloadValidation = validate(EValidationTypes.textValidation, { sourceName: 'Workload', source: workloadPlanField.value?.toString()! }, { regex: /^[\d]{1,2}(\.[\d]{1,2})?$/g })

        if (workloadValidation.responseMessage)
        {
          workloadErrorMessage.value = workloadValidation.responseMessage
          return
        }

        const newPersonnelResource = new PersonnelResource(
          titleValidation.payload!, 
          parseFloat(workloadValidation.payload!),
          employeeFunctionValue.value!,
          availableEmployeeValue.value!
        )

        resources.value.push(newPersonnelResource)
      }
      else throw new Error(`Unknown resource type '${resourceTypeValue.value}'`)

      console.log(resources);
    }

    const removeResource = (res: IResource) => resources.value = resources.value.filter(r => r.title != res.title)

    const validateInput = (minItems = 1) => {
      if (resources.value.length >= minItems)
      {
        errorMessage.value = ''
        return resources.value
      }
      else
      {
        errorMessage.value = `'${props.inputName}' must contain at least ${minItems} item${minItems == 1 ? '' : 's'}`
        return null
      }
    }
    
    return {
      addResource,
      removeResource,
      errorMessage,
      validateInput,
      titleErrorMessage,
      workloadErrorMessage,
      costErrorMessage,
      resourceTypeValue,
      employeeFunctions,
      employeeFunctionValue,
      availableEmployeeValue,
      availableEmployees,
      workloadPlanField,
      costCenterValue,
      costCenters,
      costPlanField,
      titleValue,
      resources,
      resourceTypes
    }
  }
})
</script>