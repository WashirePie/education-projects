<template>

  <!-- New employee modal -->
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
            Register a new employee
          </h1>
        </div>

        <!-- Form components -->
        <PrimerFieldText
          ref="nameField"
          inputName="Name"
          placeHolder="Name"
        />

        <PrimerFieldText
          ref="lastNameField"
          inputName="Lastname"
          placeHolder="Lastname"
        />

        <PrimerFieldText
          ref="departmentField"
          inputName="Department"
          inputDescription="Name of the department this employee is currently assigned to"
          placeHolder="R&amp;D"
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
          inputType="number"
          placeHolder="42.5"
        />

        <PrimerFieldSelectMultiple
          ref="functionsField"
          inputName="Functions"
          inputDescription="Select the possible functions this employee can occupy"
          :inputSource="employeeFunctions"
        />      
      </div>
    </template>

    <!-- Plan this / cancel buttons -->
    <template v-slot:footer>
      <div class="container-md">
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="saveNewEmployee"
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
import PrimerFieldSelectMultiple from '@/components/PrimerFieldSelectMultiple.vue'
import PrimerIcon from '@/components/PrimerIcon.vue'
import { computed, defineComponent, getCurrentInstance, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { Employee, IEmployeeFunction } from '@/interfaces/employee'
import { IPrimerSelectMultipleItem } from '@/interfaces/primerField'
import { ActionTypes } from '@/store/actions'
import { EValidationTypes } from '@/helpers/validators'

export default defineComponent({
  name: 'ModalFormNewEmployee',
  components: {
    PrimerFieldText,
    PrimerFieldSelectMultiple,
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
    const nameField       = ref<Ref | null>(null)
    const lastNameField   = ref<Ref | null>(null)
    const departmentField = ref<Ref | null>(null)
    const persIdField     = ref<Ref | null>(null)
    const workloadField   = ref<Ref | null>(null)
    const functionsField  = ref<Ref | null>(null)

    const employeeFunctions = computed(() =>
    {
      const functions: Array<IEmployeeFunction> = store.state.employeeFunctions
      const mapped: Array<IPrimerSelectMultipleItem> = functions.map(f => 
      {
        return { name: f.name, payload: f.name, note: f.note, state: false } as IPrimerSelectMultipleItem
      })
      return mapped
    })


    const saveNewEmployee = () =>
    {
      const name: string         = nameField.value.validateInput(EValidationTypes.textValidation, { minChar: 2, maxChar: 60, regex: 'default' })
      const lastName: string     = lastNameField.value.validateInput(EValidationTypes.textValidation, { minChar: 2, maxChar: 60, regex: 'default' })
      const department: string   = departmentField.value.validateInput(EValidationTypes.textValidation, { minChar: 2, maxChar: 60, regex: 'default' })
      const id: string           = persIdField.value.validateInput(EValidationTypes.textValidation, { regex: /^#[\d]{5}$/g })
      const load: string         = workloadField.value.validateInput(EValidationTypes.textValidation, { regex: /^[\d]{1,2}(\.[\d]{1,2})?$/g })
      const funcs: Array<string> = functionsField.value.validateInput(1)

      if (name && lastName && department && id && load && funcs)
      {
        const possibleFunctions: Array<IEmployeeFunction> = funcs.map(f => { return { name: f } as IEmployeeFunction })
        const workload = parseFloat(load)

        const newEmployee: Employee = new Employee(
          name, 
          lastName, 
          department, 
          id, 
          workload, 
          possibleFunctions,
        )

        store.dispatch(ActionTypes.storeEmployee, newEmployee)
          .then((res: string) => console.log(res))
          .catch((err: string) => console.log(err))
          .finally(() => 
          {
            loadingbar.finish()
            emit('done')
          })       }
    }

    return { 
      saveNewEmployee, 
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
