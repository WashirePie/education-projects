<template>
  <!-- Title -->
  <div class="Subhead hx_Subhead--responsive mb-5">
    <h1 class="Subhead-heading ">
      Register a new cost center
    </h1>
  </div>

  <!-- Form components -->
  <PrimerFieldText
    ref="titleField"
    inputName="Title"
    placeHolder="Title"
    inputDescription="Set a unique title for your new cost center"
  />

  <PrimerFieldText
    ref="idField"
    inputName="Identifier"
    placeHolder="CC123"
    inputDescription="Set a unique identifier starting with 'CC' followed by a 3 digit code"
  />
</template>
<script lang="ts">
import PrimerFieldText from '@/components/PrimerFieldText.vue'
import { CostCenter } from '@/interfaces/costCenter'
import { defineComponent, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { ActionTypes } from '@/store/actions'
import { EValidationTypes } from '@/helpers/validators'

export default defineComponent({
  name: 'FormNewCostCenter',
  components: {
    PrimerFieldText
  },
  setup ()
  {
    // Grab Vuex store, Equal's Loadingbar and Notification
    const store = useStore()

    // Setup references for the form fields
    const titleField  = ref<Ref | null>(null)
    const idField     = ref<Ref | null>(null)

    const validateForm = (): Promise<string> =>
    {
      return new Promise<string>((resolve, reject) =>
      {
        const title = titleField.value.validateInput(EValidationTypes.textValidation, { minChar: 2, maxChar: 60, regex: 'default' })
        const id    = idField.value.validateInput(EValidationTypes.textValidation, { regex: /^CC[\d]{3}$/g })

        if (title && id)
        {
          const newCostCenter = new CostCenter(title, id)

          store.dispatch(ActionTypes.storeCostCenter, newCostCenter)
            .then((res: string) => resolve(res))
            .catch((err: string) => reject(err))
        }
        else reject(new Error('Not valid'))        
      })
    }

    return { 
      validateForm, 
      titleField, 
      idField 
    }
  }
})
</script>
