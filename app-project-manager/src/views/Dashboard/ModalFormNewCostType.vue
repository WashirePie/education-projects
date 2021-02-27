<template>
  <!-- New cost type modal -->
  <PrimerModal v-if="show" :displayFooter="true" :displayHeader="false">
    <template v-slot:body>
      <div class="container-md">
        <!-- Title -->
        <div class="Subhead hx_Subhead--responsive mb-5">
          <h1 class="Subhead-heading">Register a new cost type</h1>
        </div>

        <!-- Form components -->
        <InputFieldText
          ref="titleField"
          inputName="Title"
          placeHolder="Title"
          inputDescription="Set a unique title for your new cost type"
        />

        <InputFieldText
          ref="idField"
          inputName="Identifier"
          placeHolder="CT123"
          inputDescription="Set a unique identifier starting with 'CT' followed by a 3 digit code"
        />
      </div>
    </template>

    <!-- Plan this / cancel buttons -->
    <template v-slot:footer>
      <div class="container-md">
        <!-- Error message -->
        <p class="note text-red d-block" v-if="errorMessage">{{ errorMessage }}</p>

        <!-- 'Save' / 'Discard' buttons -->

        <div class="mt-2">
          <button class="btn btn-primary mr-2" type="button" @click="saveNewCostType">
            <Octicon octicon="download" />
            <span>Save</span>
          </button>

          <button class="btn btn-danger mr-2" type="button" @click="$emit('discard')">
            <Octicon octicon="trash" />
            <span>Discard</span>
          </button>
        </div>
      </div>
    </template>
  </PrimerModal>
</template>
<script lang="ts">
import InputFieldText from "@/components/InputFieldText.vue";
import Octicon from "@/components/Octicon.vue";
import { CostType } from "@/classes/costType";
import { defineComponent, getCurrentInstance, ref } from "vue";
import { useStore } from "@/store";
import { ActionTypes } from "@/store/actions";

export default defineComponent({
  name: "ModalFormNewCostType",
  components: {
    InputFieldText,
    Octicon,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["discard", "done"],
  setup(props, { emit }) {
    const store = useStore();
    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar;

    const errorMessage = ref<string>("");

    // Setup references for the form fields
    const titleField = ref<InstanceType<typeof InputFieldText>>();
    const idField = ref<InstanceType<typeof InputFieldText>>();

    const saveNewCostType = () => {
      const title = titleField.value!.validateInput({ minChar: 2, maxChar: 60, regex: "default" });
      const id = idField.value!.validateInput({ regex: /^CT[\d]{3}$/g });

      if (title && id) {
        const newCostType = new CostType(title, id);

        store
          .dispatch(ActionTypes.storeCostType, newCostType)
          .then((res: string) => {
            emit("done");
            errorMessage.value = "";
          })
          .catch((err: Error) => (errorMessage.value = err.message))
          .finally(() => loadingbar.finish());
      }
    };

    return {
      errorMessage,
      saveNewCostType,
      titleField,
      idField,
    };
  },
});
</script>
