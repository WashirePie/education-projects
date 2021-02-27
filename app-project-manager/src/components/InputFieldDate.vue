<template>
  <!-- Label & description -->
  <div class="form-group">
    <div class="form-group-header">
      <label :for="inputName">{{ inputName }}</label>
    </div>
    <span class="text-small text-gray" v-if="inputDescription">{{ inputDescription }}</span>
  </div>

  <!-- Input field -->
  <div class="form-group-body">
    <input
      :class="`form-control ${errorMessage ? 'border-red' : ''}`"
      :id="inputName"
      type="date"
      v-model="inputValue"
    />

    <p class="note text-red" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { EValidationTypes, useValidation, ValidationParams, ValidationReturns } from "@/helpers/validators";
import { defineComponent, watch, ref, PropType, onMounted } from "vue";

export default defineComponent({
  name: "InputFieldDate",
  props: {
    inputName: {
      type: String,
      default: "Generic Date Input",
    },
    inputDescription: {
      type: String,
      default: "",
    },
    placeHolder: {
      type: Date as PropType<Date>,
      default: () => new Date(),
    },
  },
  emits: ["valueChanged"],
  setup(props, { emit }) {
    let placeHolderISODate = props.placeHolder.toISOString();
    placeHolderISODate = placeHolderISODate.substring(0, placeHolderISODate.split("").indexOf("T"));

    const inputValue = ref<string>(placeHolderISODate);
    const errorMessage = ref<string>("");

    const validate = useValidation();

    const parseISOString = (s: string): Date => {
      let b = s.split(/\D+/).map((n) => parseFloat(n));
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3] | 11, b[4] | 0, b[5] | 0, b[6] | 0));
    };

    // Reset Error message when typing continues
    watch(inputValue, () => {
      errorMessage.value = "";
      emit("valueChanged");
    });

    const validateInput = (
      params: ValidationParams[EValidationTypes.dateValidation]
    ): ValidationReturns[EValidationTypes.dateValidation]["payload"] => {
      let date = parseISOString(inputValue.value);

      let res = validate(
        EValidationTypes.dateValidation,
        { source: date, sourceName: props.inputName },
        params
      ) as ValidationReturns[EValidationTypes.dateValidation];
      errorMessage.value = res.responseMessage;
      return res.payload;
    };

    return {
      inputValue,
      errorMessage,
      validateInput,
    };
  },
});
</script>