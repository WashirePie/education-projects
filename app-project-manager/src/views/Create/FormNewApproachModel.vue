<template>
  <!-- Title -->
  <div class="Subhead hx_Subhead--responsive mb-5">
    <h1 class="Subhead-heading ">
      Create a new approach model
    </h1>
  </div>

  <!-- Form components -->
  <PrimerFieldText
    ref="titleField"
    inputName="Title"
    placeHolder="Title"
    inputDescription="Set a unique title for your new approach model"
  />

  <PrimerFieldArrayText
    ref="phaseTitlesField"
    inputName="Phases"
    placeHolder="Phasetitle"
    inputDescription="Add phasetitles, separated by a comma"
  />
</template>

<script lang="ts">
import PrimerFieldArrayText from '@/components/PrimerFieldArrayText.vue'
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import { defineComponent, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { ApproachModel } from '@/interfaces/approachModel'
import { ActionTypes } from '@/store/actions'
import { EValidationTypes } from '@/helpers/validators'

export default defineComponent({
  name: 'FormNewApproachModel',
  components: {
    PrimerFieldText,
    PrimerFieldArrayText
  },
  setup()
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()

    // Setup references for the form fields
    const titleField        = ref<Ref | null>(null)
    const phaseTitlesField  = ref<Ref | null>(null)

    const validateForm = (): Promise<string> =>
    {
      return new Promise<string>((resolve, reject) =>
      {
        const title       = titleField.value.validateInput(EValidationTypes.textValidation, { minChar: 2, maxChar: 60, regex: 'default' })
        const phaseTitles = phaseTitlesField.value.validateInput(1)
                
        if (title && phaseTitles)
        {
          const newApproachModel = new ApproachModel(title, phaseTitles)

          store.dispatch(ActionTypes.storeApproachModel, newApproachModel)
            .then((res: string) => resolve(res))
            .catch((err: string) => reject(err))
        }
        else reject(new Error('Not valid'))        
      })
    }

    return { 
      validateForm, 
      titleField, 
      phaseTitlesField }
  }
})
</script>
