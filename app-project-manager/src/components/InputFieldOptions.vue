<template>
  <!-- Label & description -->
  <div class="form-group">
    <div class="form-group-header">
      <label>{{ inputName }}</label>
    </div>
    <span class="text-small text-gray" v-if="inputDescription">{{ inputDescription }}</span>
  </div>

  <!-- Input field -->
  <div class="form-group-body">
    <div v-for="item in inputSource" :key="item.name" class="form-checkbox">
      <label :class="`${errorMessage ? 'text-red' : ''}`">
        <input type="checkbox" v-model="item.state" :aria-describedby="item.name" />
        {{ item.name }}
      </label>
      <p class="note" :id="item.name">{{ item.note }}</p>
    </div>

    <p class="note text-red" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

export interface IOptionItem {
  name: string;
  payload: any;
  note: string;
  state: false;
}

export default defineComponent({
  name: "InputFieldOptions",
  props: {
    inputName: {
      type: String,
      default: "Generic Select Multiple Input",
    },
    inputDescription: {
      type: String,
      default: "",
    },
    inputSource: {
      type: Array as PropType<Array<IOptionItem>>,
      default: () => [
        { name: "Option 1", note: "Available", state: true, payload: 1 },
        { name: "Option 2", note: "Available", state: false, payload: 1 },
      ],
    },
  },
  setup(props) {
    const errorMessage = ref<string>("");
    const validateInput = (
      minSelected = 1,
      maxSelected = props.inputSource.length
    ): Array<IOptionItem["payload"]> | null => {
      const selected = props.inputSource.filter((i) => i.state).length;

      const validation =
        selected < minSelected
          ? `'${props.inputName}' should have at least ${minSelected} item${minSelected == 1 ? "" : "s"} selected`
          : selected > maxSelected
          ? `'${props.inputName}' should have no more than ${maxSelected} item${minSelected == 1 ? "" : "s"} selected`
          : "";

      if (validation) errorMessage.value = validation;
      else {
        errorMessage.value = "";
        return props.inputSource.filter((i) => i.state).map((i) => i.payload);
      }

      return null;
    };

    return {
      validateInput,
      errorMessage,
    };
  },
});
</script>
