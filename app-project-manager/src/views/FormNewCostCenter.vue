<template>
  <div class="Subhead hx_Subhead--responsive mb-5">
    <h1 class="Subhead-heading ">
      Register a new cost center
    </h1>
  </div>

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
import { defineComponent, Ref, ref } from 'vue'
import { useStore } from 'vuex'

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
    const titleField = ref<Ref | null>(null)
    const idField = ref<Ref | null>(null)

    const validateForm: Promise<unknown> = () =>
    {
      return new Promise((resolve, reject) =>
      {
        const title = titleField.value.validateInput(2, 60)
        const identifier = idField.value.validateInputCustom(/CC[\d]{3}/g)

        if (title && identifier)
        {
          store.dispatch('storeCostCenter', { title, identifier })
            .then(res => resolve(res))
            .catch(err => reject(err))
        }
      })
    }

    return { validateForm, titleField, idField }
  }
})
</script>
