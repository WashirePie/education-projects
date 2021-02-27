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
      @keyup="addItem"
      type="text"
      v-model="inputValue"
      :placeholder="placeHolder"
    />

    <p class="note text-red" v-if="errorMessage">{{ errorMessage }}</p>

    <div class="my-3"></div>

    <!-- Items array -->
    <div class="Box">
      <div class="Box-row" v-for="item in items" :key="item">
        <span>{{ item }}</span>
        <div class="float-right">
          <button class="btn-octicon" type="button" @click="changeOrder(item, -1)">
            <Octicon octicon="chevron-up" />
          </button>
          <button class="btn-octicon" type="button" @click="changeOrder(item, 1)">
            <Octicon octicon="chevron-down" />
          </button>
          <button class="btn-octicon btn-octicon-danger" type="button" @click="removeItem(item)">
            <Octicon octicon="x" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EValidationTypes, useValidation } from "@/helpers/validators";
import { defineComponent, ref } from "vue";
import Octicon from "@/components/Octicon.vue";

export default defineComponent({
  name: "InputFieldOrderableText",
  components: {
    Octicon,
  },
  props: {
    inputName: {
      type: String,
      default: "Generic Orderable Text Input",
    },
    inputDescription: {
      type: String,
      default: "",
    },
    placeHolder: {
      type: String,
      default: "Placeholder",
    },
  },
  setup(props) {
    const validate = useValidation();

    const inputValue = ref<string>("");
    const errorMessage = ref<string>("");
    const items = ref<Array<string>>([]);

    const addItem = (event: KeyboardEvent) => {
      // Check if ',' was pressed and there's a value inside the input field
      if (event.code === "Comma" && inputValue.value) {
        // Grab a temporary reference and trim trailing comma
        const tempItem = inputValue.value.substr(0, inputValue.value.length - 1);

        // Validate phase titles
        const res = validate(
          EValidationTypes.textValidation,
          { sourceName: props.inputName, source: tempItem },
          {
            maxChar: 60,
            minChar: 2,
            duplicatesArray: items.value,
            regex: "default",
          }
        );

        errorMessage.value = res.responseMessage;

        if (!res.payload) inputValue.value = tempItem;
        else {
          inputValue.value = "";
          items.value.push(tempItem);
        }
      } else {
        errorMessage.value = "";
      }
    };
    const removeItem = (itemToRemove: string) => (items.value = items.value.filter((i) => i != itemToRemove));

    const changeOrder = (selectedItem: string, change: number) => {
      // Grab indices
      const oldIndex = items.value.indexOf(selectedItem);
      const newIndex = oldIndex + change;

      // Check edge cases
      if (!(newIndex < 0 || newIndex > items.value.length - 1)) {
        // Swap
        const temp = items.value[newIndex];
        items.value[newIndex] = selectedItem;
        items.value[oldIndex] = temp;
      }
    };

    const validateInput = (minItems = 1) => {
      if (items.value.length >= minItems) {
        errorMessage.value = "";
        return items.value.map((v) => v);
      } else {
        errorMessage.value = `'${props.inputName}' must specify at least ${minItems} item${minItems == 1 ? "" : "s"}`;
        return null;
      }
    };

    return {
      items,
      inputValue,
      errorMessage,
      addItem,
      removeItem,
      changeOrder,
      validateInput,
    };
  },
});
</script>
