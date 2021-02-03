<template>
  <div class="pm-create-form-approach-model">
    <h2>Define a new Approach Model</h2>

    <h3>Title</h3>
    <FormTextInput
      ref="titleField"
      input-name="Title"
      :hide-label="true"
    />

    <h3>Phase Titles</h3>
    <FormTextArrayInput
      ref="phaseTitlesField"
      input-name="Phase Titles"
      input-desc=", separated with a comma"
      :is-sortable="true"
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
import FormTextArrayInput from '@/components/FormTextArrayInput.vue'

export default defineComponent({
  name: 'CreateApproachModel',
  components: {
    FormTextInput,
    FormTextArrayInput
  },
  setup ()
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()
    const loadingBar = getCurrentInstance()!.appContext.config.globalProperties.$Loading
    const notification = getCurrentInstance()!.appContext.config.globalProperties.$Notification

    // Setup references for the form fields
    // TODO: Make components like this: https://medium.com/dev-genius/my-experience-with-vue-3-and-typescript-so-far-564bb65d4e39
    // TODO: Fix the refs to Elements (see below) it's defenitely not ref<HTMLElement | null>()
    // TODO: Make an Enum for Priorities for the Project Priority and link it in the CreateProject Form
    // TODO: Port the store logic from prev Prototype
    const titleField = ref<any>(null)
    const phaseTitlesField = ref<any>(null)

    console.log(titleField)

    const isLoading = ref(false)

    const validateForm = () =>
    {
      const title = titleField.value.validateInput(2, 60)
      const phaseTitles = phaseTitlesField.value.validateInput(1)

      if (title && phaseTitles)
      {
        isLoading.value = true
        loadingBar.start()

        store.dispatch('storeApproachModel', { title, phases: phaseTitles })
          .then((res) => notification.success({ title: 'Success', text: res }))
          .catch((err) => notification.danger({ title: 'Could not store Approach Model', text: err.message }))
          .finally(() =>
          {
            loadingBar.finish()
            isLoading.value = false
          })
      }
    }

    return { validateForm, titleField, phaseTitlesField, isLoading }
  }
})
</script>

<style lang="scss">

</style>
