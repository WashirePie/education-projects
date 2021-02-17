<template>

  <!-- New cost type modal -->
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
      </div>
    </template>

    <!-- Plan this / cancel buttons -->
    <template v-slot:footer>
      <div class="container-md">
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="saveNewCostType"
        >
          <PrimerIcon octicon="download" />
          <span>Save</span>
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
import PrimerIcon from '@/components/PrimerIcon.vue'
import { CostType } from '@/interfaces/costType'
import { defineComponent, getCurrentInstance, Ref, ref } from 'vue'
import { useStore } from '@/store'
import { ActionTypes } from '@/store/actions'
import { EValidationTypes } from '@/helpers/validators'

export default defineComponent({
  name: 'ModalFormNewCostType',
  components: {
    PrimerFieldText,
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
    const titleField  = ref<Ref | null>(null)
    const idField     = ref<Ref | null>(null)

    const saveNewCostType = () =>
    {
      const title = titleField.value.validateInput(EValidationTypes.textValidation, { minChar: 2, maxChar: 60, regex: 'default' })
      const id    = idField.value.validateInput(EValidationTypes.textValidation, { regex: /^CC[\d]{3}$/g })

      if (title && id)
      {
        const newCostType = new CostType(title, id)

        store.dispatch(ActionTypes.storeCostType, newCostType)
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
      saveNewCostType, 
      titleField, 
      idField 
    }
  }
})
</script>
