<template>

  <!-- New approach moddel modal -->
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
            Create a new approach model
          </h1>
        </div>

        <!-- Form components -->
        <InputFieldText
          ref="titleField"
          inputName="Title"
          placeHolder="Title"
          inputDescription="Set a unique title for your new approach model"
        />

        <InputFieldOrderableText
          ref="phaseTitlesField"
          inputName="Phases"
          placeHolder="Phasetitle"
          inputDescription="Add phasetitles, separated by a comma"
        />
      </div>
    </template>

    <!-- Plan this / cancel buttons -->
    <template v-slot:footer>
      <div class="container-md">
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="saveNewApproachModel"
        >
          <Octicon octicon="download" />
          <span>Save</span>
        </button>

        <button
          class="btn btn-danger mr-2"
          type="button"
          @click="$emit('discard')"
        >
          <Octicon octicon="trash" />
          <span>Discard</span>
        </button>
      </div>

    </template>

  </PrimerModal>

</template>

<script lang="ts">
import InputFieldOrderableText from '@/components/InputFieldOrderableText.vue'
import InputFieldText from '@/components/InputFieldText.vue'
import Octicon from '@/components/Octicon.vue'
import { defineComponent, getCurrentInstance, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { ApproachModel } from '@/interfaces/approachModel'
import { ActionTypes } from '@/store/actions'
import { EValidationTypes } from '@/helpers/validators'

export default defineComponent({
  name: 'ModalFormNewApproachModel',
  components: {
    InputFieldText,
    InputFieldOrderableText,
    Octicon
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['discard', 'done'],
  setup(props, { emit })
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()
    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar

    // Setup references for the form fields
    const titleField       = ref<InstanceType<typeof InputFieldText>>()
    const phaseTitlesField = ref<InstanceType<typeof InputFieldOrderableText>>()

    const saveNewApproachModel = () =>
    {
      const title       = titleField.value!.validateInput({ minChar: 2, maxChar: 60, regex: 'default' })
      const phaseTitles = phaseTitlesField.value!.validateInput(1)
              
      if (title && phaseTitles)
      {
        const newApproachModel = new ApproachModel(title, phaseTitles)

        loadingbar.start()

        store.dispatch(ActionTypes.storeApproachModel, newApproachModel)
          .then((res: string) => console.log(res))
          .catch((err: string) => console.log(err))
          .finally(() => 
          {
            loadingbar.finish()
            emit('done')
          })     
      }
    }

    return { 
      saveNewApproachModel, 
      titleField, 
      phaseTitlesField }
  }
})
</script>
