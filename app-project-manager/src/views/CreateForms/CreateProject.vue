<template>
  <div class="pm-create-form-approach-model">
    <h2>Create a new Project</h2>

    <h3>Title</h3>
    <FormTextInput
      ref="titleField"
      input-name="Title"
      :hide-label="true"
    />

    <h3>Select Approach Model</h3>
    <FormSelectInput
      ref="approachModelField"
      input-name="Model"
      :select-options="approachModels"
      display-property="title"
    />

    <h3>Priority</h3>
    <FormSelectInput
      ref="priorityField"
      input-name="Priority"
      :select-options="[{ index: 'Low' }, { index: 'Medium' }, { index: 'High' }]"
    />

    <h3>Description</h3>
    <FormTextInput
      ref="descField"
      input-name="Project Description"
      :hide-label="true"
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
import FormSelectInput from '@/components/FormSelectInput.vue'

export default defineComponent({
  name: 'CreateApproachModel',
  components: {
    FormTextInput,
    FormSelectInput
  },
  setup ()
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()
    const loadingBar = getCurrentInstance()!.appContext.config.globalProperties.$Loading
    const notification = getCurrentInstance()!.appContext.config.globalProperties.$Notification

    // Setup references for the form fields
    const titleField = ref<any>(null)
    const approachModelField = ref<any>(null)
    const priorityField = ref<any>(null)
    const descField = ref<any>(null)

    const approachModels = ref(store.state.approachModels)
    const isLoading = ref(false)

    const validateForm = () =>
    {
      const title = titleField.value.validateInput(2, 60)
      const model = approachModelField.value.validateInput()
      const priority = priorityField.value.validateInput()
      const description = descField.value.validateInput(2, 100)

      if (title && model && priority && description)
      {
        isLoading.value = true
        loadingBar.start()

        store.dispatch('storeProject', { title, model, priority, description })
          .then((res) => notification.success({ title: 'Success', text: res }))
          .catch((err) => notification.danger({ title: 'Could not store Project', text: err.message }))
          .finally(() =>
          {
            loadingBar.finish()
            isLoading.value = false
          })
      }
    }

    return { validateForm, titleField, approachModelField, priorityField, descField, approachModels, isLoading }
  }
})
</script>

<style lang="scss">

</style>
