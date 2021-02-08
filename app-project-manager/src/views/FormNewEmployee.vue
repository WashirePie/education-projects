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
import { defineComponent, Ref, ref } from 'vue'
import { useStore } from 'vuex'
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import PrimerFieldSelectMultiple from '@/components/PrimerFieldSelectMultiple.vue'
import { PrimerSelectMultipleItem } from '@/interfaces/primerField'

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
    const nameField = ref<Ref | null>(null)
    const lastNameField = ref<Ref | null>(null)
    const departmentField = ref<Ref | null>(null)
    const persIdField = ref<Ref | null>(null)
    const workloadField = ref<Ref | null>(null)
    const functionsField = ref<Ref | null>(null)

    // TODO: Grab this from vuex
    // const employeeFunctions = ref(store.state.employeeFunctions)
    const employeeFunctions: Array<PrimerSelectMultipleItem> = [
      { name: 'Developer', note: 'Available for developer functions', state: false, payload: 'Developer' },
      { name: 'Designer', note: 'Available for designer functions', state: false, payload: 'Designer' },
      { name: 'Project Lead', note: 'Available as project lead', state: false, payload: 'Project Lead' },
      { name: 'Administrator', note: 'Available for administrative functions', state: false, payload: 'Administrator' }
    ]

    const validateForm: Promise<unknown> = () =>
    {
      return new Promise((resolve, reject) =>
      {
        const name = nameField.value.validateInput(2, 60)
        const lastName = lastNameField.value.validateInput(2, 60)
        const department = departmentField.value.validateInput(2, 60)
        const persId = persIdField.value.validateInputCustom(/#[\d]{5}/g)
        const workload = workloadField.value.validateInputCustom(/[\d]{1,2}(\.[\d]{2})?/g)
        const funcs = functionsField.value.validateInput(1)

        if (name && lastName && department && persId && workload && funcs)
        {
          store.dispatch('storeEmployee', { name, lastName, department, personellIdentifier: persId, workload, possibleFunctions: funcs })
            .then(res => resolve(res))
            .catch(err => reject(err))
        }
      })
    }

    return { validateForm, nameField, lastNameField, departmentField, functionsField, workloadField, persIdField, employeeFunctions }
  }
})
</script>
