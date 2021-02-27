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
    <select v-model="inputValue" :class="`form-select ${errorMessage ? 'border-red' : ''}`" :id="inputName">
      <option>{{ placeHolder }}</option>
      <option v-for="option in selectOptions" :key="option.name">{{ option.name }}</option>
    </select>

    <p class="note text-red" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, PropType } from "vue";

export interface ISelectItem {
  name: string;
  payload: any;
}

export default defineComponent({
  name: "InputFieldSelect",
  props: {
    inputName: {
      type: String,
      default: "Generic Select Input",
    },
    inputDescription: {
      type: String,
      default: "",
    },
    selectOptions: {
      type: Array as PropType<Array<ISelectItem>>,
      default: () => [
        { name: "Low", payload: 1 },
        { name: "Medium", payload: 2 },
        { name: "High", payload: 3 },
      ],
    },
    placeHolder: {
      type: String,
      default: "Choose an option",
    },
  },
  setup(props) {
    const inputValue = ref<string>("");
    const errorMessage = ref<string>("");

    onMounted(() => (inputValue.value = props.placeHolder));

    watch(inputValue, () => (errorMessage.value = ""));

    const validateInput = (): ISelectItem["payload"] => {
      if (inputValue.value == props.placeHolder) {
        errorMessage.value = `'${props.inputName}' must specify a value`;
        return null;
      } else {
        errorMessage.value = "";
        return props.selectOptions.filter((o) => o.name == inputValue.value)[0].payload;
      }
    };

    return {
      validateInput,
      errorMessage,
      inputValue,
    };
  },
});
</script>