<template>
  <div class="pm-create-form-employee">
    <h2>Register a new Employee</h2>

    <h3>Name</h3>
    <FormTextInput
      ref="nameField"
      input-name="Name"
      :hide-label="true"
    />

    <h3>Lastname</h3>
    <FormTextInput
      ref="lastNameField"
      input-name="Lastname"
      :hide-label="true"
    />

    <h3>Personell Identifier</h3>
    <FormTextInput
      ref="persIdField"
      input-name="Personell Identifier"
      :hide-label="true"
    />

    <h3>Workload</h3>
    <p>Available hours per week</p>
    <FormNumberInput
      ref="workloadField"
      :input-options="{ min: 0, max: 60, step: 0.5, init: 42.5 }"
      :hide-label="true"
    />

    <h3>Possible Functions</h3>
    <FormSelectMultiple
      ref="functionsField"
      input-name="Possible Functions"
      :input-source="employeeFunctions"
    />

    <br>

    <it-button
      type="primary"
      round
      :disabled="isLoading"
      @click="validateForm"
    >
      Save
    </it-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import FormTextInput from '@/components/FormTextInput.vue'
import FormSelectMultiple from '@/components/FormSelectMultiple.vue'
import FormNumberInput from '@/components/FormNumberInput.vue'

export default defineComponent({
  name: 'CreateEmployee',
  components: {
    FormTextInput,
    FormSelectMultiple,
    FormNumberInput
  },
  setup ()
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()
    const loadingBar = getCurrentInstance()!.appContext.config.globalProperties.$Loading
    const notification = getCurrentInstance()!.appContext.config.globalProperties.$Notification

    // Setup references for the form fields
    const nameField = ref<any>(null)
    const lastNameField = ref<any>(null)
    const persIdField = ref<any>(null)
    const functionsField = ref<any>(null)
    const workloadField = ref<any>(null)

    const employeeFunctions = ref(store.state.employeeFunctions)
    const isLoading = ref(false)

    const validateForm = () =>
    {
      const name = nameField.value.validateInput(2, 60)
      const lastName = lastNameField.value.validateInput(2, 60)
      const persId = persIdField.value.validateInputCustom(/#[\d]{6}/g)
      const workload = workloadField.value.validateInput()
      const funcs = functionsField.value.validateInput(1)

      if (name && lastName && persId && workload && funcs)
      {
        isLoading.value = true
        loadingBar.start()

        store.dispatch('storeEmployee', { name, lastName, personellIdentifier: persId, workload, possibleFunctions: funcs })
          .then((res) => notification.success({ title: 'Success', text: res }))
          .catch((err) => notification.danger({ title: 'Could not store Employee', text: err.message }))
          .finally(() =>
          {
            loadingBar.finish()
            isLoading.value = false
          })
      }
    }

    return { validateForm, nameField, lastNameField, functionsField, workloadField, persIdField, employeeFunctions, isLoading }
  }
})
</script>

<style lang="scss">

</style>
