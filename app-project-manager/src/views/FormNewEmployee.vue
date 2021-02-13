<template>
  <div class="Subhead hx_Subhead--responsive mb-5">
    <h1 class="Subhead-heading ">
      Register a new employee
    </h1>
  </div>

  <PrimerFieldText
    ref="nameField"
    inputName="Name"
    placeHolder="Name"/>

  <PrimerFieldText
    ref="lastNameField"
    inputName="Lastname"
    placeHolder="Lastname"
  />

  <PrimerFieldText
    ref="departmentField"
    inputName="Department"
    inputDescription="Name of the department this employee is currently assigned to"
    placeHolder="R&D"
  />

  <PrimerFieldText
    ref="persIdField"
    inputName="Personell Identifier"
    inputDescription="Set a unique personell identifier starting with '#' followed by a 5 digit code"
    placeHolder="#12345"
  />

  <PrimerFieldText
    ref="workloadField"
    inputName="Workload"
    inputDescription="Available work hours per week"
    placeHolder="42.5"
  />

  <PrimerFieldSelectMultiple
    ref="functionsField"
    inputName="Functions"
    inputDescription="Select the possible functions this employee can occupy"
    :inputSource="employeeFunctions"
  />
</template>

<script lang="ts">
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import PrimerFieldSelectMultiple from '@/components/PrimerFieldSelectMultiple.vue'
import { computed, defineComponent, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { Employee, IEmployeeFunction } from '@/interfaces/employee'
import { IPrimerSelectMultipleItem } from '@/interfaces/primerField'
import { ActionTypes } from '@/store/actions'

export default defineComponent({
  name: 'FormNewEmployee',
  components: {
    PrimerFieldText,
    PrimerFieldSelectMultiple
  },
  setup ()
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()

    // Setup references for the form fields
    const nameField       = ref<Ref | null>(null)
    const lastNameField   = ref<Ref | null>(null)
    const departmentField = ref<Ref | null>(null)
    const persIdField     = ref<Ref | null>(null)
    const workloadField   = ref<Ref | null>(null)
    const functionsField  = ref<Ref | null>(null)

    const employeeFunctions = computed(() =>
    {
      let functions: Array<IEmployeeFunction> = store.state.employeeFunctions
      let mapped: Array<IPrimerSelectMultipleItem> = functions.map(f => 
      {
        return <IPrimerSelectMultipleItem> { name: f.name, payload: f.name, note: f.note, state: false } 
      })
      return mapped
    })


    const validateForm = (): Promise<string> =>
    {
      return new Promise<string>((resolve, reject) =>
      {
        const name = nameField.value.validateInput(2, 60)
        const lastName = lastNameField.value.validateInput(2, 60)
        const department = departmentField.value.validateInput(2, 60)
        const id = persIdField.value.validateInputCustom(/^#[\d]{5}$/g)
        const workload = workloadField.value.validateInputCustom(/^[\d]{1,2}(\.[\d]{2})?$/g)
        const funcs: Array<string> = functionsField.value.validateInput(1)

        const possibleFunctions: Array<IEmployeeFunction> = funcs.map(f => { return <IEmployeeFunction>{ name: f } })

        if (name && lastName && department && id && workload && possibleFunctions)
        {
          const newEmployee: Employee = {
            name, 
            lastName, 
            department, 
            id, 
            workload, 
            possibleFunctions,
          }

          store.dispatch(ActionTypes.storeEmployee, newEmployee)
            .then((res: string) => resolve(res))
            .catch((err: string) => reject(err))
        }
        else reject(new Error('Not valid'))        
      })
    }

    return { 
      validateForm, 
      nameField, 
      lastNameField, 
      departmentField, 
      functionsField, 
      workloadField, 
      persIdField, 
      employeeFunctions 
    }
  }
})
</script>
