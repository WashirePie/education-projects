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
      type="number"
      v-model="inputValue"
    />

    <p class="note text-red" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { EValidationTypes, useValidation, ValidationParams, ValidationReturns } from "@/helpers/validators";
import { defineComponent, watch, ref } from "vue";

export default defineComponent({
  name: "InputFieldNumber",
  props: {
    inputName: {
      type: String,
      default: "Generic Text Input",
    },
    inputDescription: {
      type: String,
      default: "",
    },
    placeHolder: {
      type: Number,
      default: 100,
    },
  },
  setup(props) {
    const inputValue = ref<number>(props.placeHolder);
    const errorMessage = ref<string>("");

    const validate = useValidation();

    // Reset Error message when typing continues
    watch(inputValue, () => (errorMessage.value = ""));

    const validateInput = (
      params: ValidationParams[EValidationTypes.numberValidation]
    ): ValidationReturns[EValidationTypes.numberValidation]["payload"] => {
      let res = validate(
        EValidationTypes.numberValidation,
        { source: inputValue.value, sourceName: props.inputName },
        params
      ) as ValidationReturns[EValidationTypes.numberValidation];
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