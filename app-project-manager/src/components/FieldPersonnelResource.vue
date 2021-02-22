<template>

  <!-- Name field -->
  <div>
    <InputFieldText
      ref="nameField"
      inputName="Resource Name"
      inputDescription="Set the name of this personnel resource"
      placeHolder="Resource name"
    />
  </div>

  <!-- Function select -->
  <div>
    <div class="form-group">
      <div class="form-group-header">
        <label>Employee Function</label>
      </div>
      <span class="text-small text-gray">Select a required function type</span>
    </div>

    <div class="form-group-body">
        <select
          v-model="employeeFunctionValue"
          class="form-select"
        >
          <option
            v-for="func in employeeFunctions" :key="func.name" 
            :value="func.name"
          >{{ func.name }}</option>
        </select>
    </div>
  </div>

  <!-- Available employees select -->
  <div>
    <div class="form-group">
      <div class="form-group-header">
        <label>Available Employees</label>
      </div>
      <span class="text-small text-gray">Assign an employee to this personnel resource</span>
    </div>

    <div class="form-group-body">
      <select
        v-model="availableEmployeeValue"
        class="form-select"
      >
        <option
          v-for="empl in availableEmployees" :key="empl.id" 
          :value="empl"
        >{{ empl.id}}: {{ empl.fullName }}</option>
      </select>
    </div>
  </div>

  <!-- Workload field -->
  <div>
    <InputFieldNumber
      ref="workloadPlanField"
      inputName="Workload (PLAN)"
      inputDescription="Set the planned amount of work (hours)"
      :placeHolder="0"
    />
  </div>

  <!-- 'Add' button -->
  <div class="py-2">
    <p
      class="note text-red"
      v-if="errorMessage"
    >{{ errorMessage }}</p>

    <button
      class="btn d-block mt-3"
      type="button"
      @click="addResource"
    >
      <Octicon octicon="plus" />
      <span>Add</span>
    </button>
  </div>
  
</template>

<script lang="ts">
import Octicon from '@/components/Octicon.vue'
import InputFieldText from '@/components/InputFieldText.vue'
import InputFieldNumber from '@/components/InputFieldNumber.vue'
import { EEmployeeFunctions, Employee, IEmployeeFunction } from "@/classes/employee";
import { IResource, PersonnelResource } from "@/classes/resource";
import { useStore } from "@/store";
import { computed, ComputedRef, defineComponent, onMounted, PropType, ref, watch } from "vue";

export default defineComponent({
  name: 'FieldResources',
  components: {
    Octicon,
    InputFieldText,
    InputFieldNumber
  },
  props: {
    resources: {
      type: Object as PropType<Array<IResource>>,
      required: true
    }
  },

  setup(props) 
  {
    const store = useStore()

    const nameField              = ref<InstanceType<typeof InputFieldText>>()
    const workloadPlanField      = ref<InstanceType<typeof InputFieldNumber>>()

    const errorMessage           = ref<string>('')
    const workloadErrorMessage   = ref<string>('')
    const employeeFunctionValue  = ref<EEmployeeFunctions>()
    const availableEmployeeValue = ref<Employee>()
    const personnelResources     = ref<Array<PersonnelResource>>([])
    const employeeFunctions: ComputedRef<Array<IEmployeeFunction>> = computed(() => store.state.employeeFunctions.filter(f => f.name != EEmployeeFunctions.ProjectLead))
    const availableEmployees: ComputedRef<Array<Employee>>         = computed(() => store.state.employees.filter(e => e.possibleFunctions.some(f => f.name == employeeFunctionValue.value)) )

    // Set default values on mounted
    onMounted(() => employeeFunctionValue.value = EEmployeeFunctions.Developer)

    // Set a default employee when the employee function type changes
    watch(employeeFunctionValue, () => availableEmployeeValue.value = availableEmployees.value[0] )

    // Reset Error messages when typing continues
    watch(workloadPlanField, () => workloadErrorMessage.value = '')

    const addResource = () =>
    {
      errorMessage.value = ''      

      const title    = nameField.value!.validateInput({ minChar: 2, maxChar: 60, regex: 'default', duplicatesArray: [...props.resources.map(r => r.title)] })
      const workload = workloadPlanField.value!.validateInput({min: 0.5, max: 500})

      if (title && workload)
      {        
        const newPersonnelResource = new PersonnelResource(
          title, 
          workload,
          employeeFunctionValue.value!,
          availableEmployeeValue.value!
        )
  
        props.resources.push(newPersonnelResource)
      }
    }
    
    return {
      addResource,
      errorMessage,
      workloadErrorMessage,
      employeeFunctions,
      employeeFunctionValue,
      availableEmployeeValue,
      availableEmployees,
      workloadPlanField,
      nameField,
      personnelResources,
    }
  }
})
</script>