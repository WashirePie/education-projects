<template>
  <div class="pm-create-form-approach-model">
    <h2>Register a new Cost Center</h2>

    <h3>Title</h3>
    <FormTextInput
      ref="titleField"
      input-name="Title"
      :hide-label="true"
    />

    <h3>Identifier</h3>
    <FormTextInput
      ref="idField"
      input-name="Identifier"
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

export default defineComponent({
  name: 'CreateApproachModel',
  components: {
    FormTextInput
  },
  setup ()
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()
    const loadingBar = getCurrentInstance()!.appContext.config.globalProperties.$Loading
    const notification = getCurrentInstance()!.appContext.config.globalProperties.$Notification

    // Setup references for the form fields
    const titleField = ref<any>(null)
    const idField = ref<any>(null)

    const isLoading = ref(false)

    const validateForm = () =>
    {
      const title = titleField.value.validateInput(2, 60)
      const identifier = idField.value.validateInputCustom(/CC[\d]{3}/g)

      if (title && identifier)
      {
        isLoading.value = true
        loadingBar.start()

        store.dispatch('storeCostCenter', { title, identifier })
          .then((res) => notification.success({ title: 'Success', text: res }))
          .catch((err) => notification.danger({ title: 'Could not store Cost Center', text: err.message }))
          .finally(() =>
          {
            loadingBar.finish()
            isLoading.value = false
          })
      }
    }

    return { validateForm, titleField, idField, isLoading }
  }
})
</script>

<style lang="scss">

</style>
