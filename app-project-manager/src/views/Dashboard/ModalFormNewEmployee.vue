<template>
  <!-- New employee modal -->
  <PrimerModal v-if="show" :displayFooter="true" :displayHeader="false">
    <template v-slot:body>
      <div class="container-md">
        <!-- Title -->
        <div class="Subhead hx_Subhead--responsive mb-5">
          <h1 class="Subhead-heading">Register a new employee</h1>
        </div>

        <!-- Form components -->
        <InputFieldText ref="nameField" inputName="Name" placeHolder="Name" />

        <InputFieldText ref="lastNameField" inputName="Lastname" placeHolder="Lastname" />

        <InputFieldText
          ref="departmentField"
          inputName="Department"
          inputDescription="Name of the department this employee is currently assigned to"
          placeHolder="R&amp;D"
        />

        <InputFieldText
          ref="persIdField"
          inputName="Personell Identifier"
          inputDescription="Set a unique personell identifier starting with '#' followed by a 5 digit code"
          placeHolder="#12345"
        />

        <InputFieldNumber
          ref="workloadField"
          inputName="Workload"
          inputDescription="Available work hours per week"
          :placeHolder="42.5"
        />

        <InputFieldOptions
          ref="functionsField"
          inputName="Functions"
          inputDescription="Select the possible functions this employee can occupy"
          :inputSource="employeeFunctions"
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
          <button class="btn btn-primary mr-2" type="button" @click="saveNewEmployee">
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
import InputFieldNumber from "@/components/InputFieldNumber.vue";
import InputFieldOptions, { IOptionItem } from "@/components/InputFieldOptions.vue";
import Octicon from "@/components/Octicon.vue";
import { computed, ComputedRef, defineComponent, getCurrentInstance, ref } from "vue";
import { useStore } from "@/store";
import { Employee, IEmployeeFunction } from "@/classes/employee";
import { ActionTypes } from "@/store/actions";

export default defineComponent({
  name: "ModalFormNewEmployee",
  components: {
    InputFieldText,
    InputFieldNumber,
    InputFieldOptions,
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
    const nameField = ref<InstanceType<typeof InputFieldText>>();
    const lastNameField = ref<InstanceType<typeof InputFieldText>>();
    const departmentField = ref<InstanceType<typeof InputFieldText>>();
    const persIdField = ref<InstanceType<typeof InputFieldText>>();
    const workloadField = ref<InstanceType<typeof InputFieldNumber>>();
    const functionsField = ref<InstanceType<typeof InputFieldOptions>>();

    const employeeFunctions: ComputedRef<Array<IOptionItem>> = computed(() => {
      const functions: Array<IEmployeeFunction> = store.state.employeeFunctions;
      const mapped: Array<IOptionItem> = functions.map((f) => {
        return { name: f.name, payload: f.name, note: f.note, state: false } as IOptionItem;
      });
      return mapped;
    });

    const saveNewEmployee = () => {
      const name = nameField.value!.validateInput({ minChar: 2, maxChar: 60, regex: "default" });
      const lastName = lastNameField.value!.validateInput({ minChar: 2, maxChar: 60, regex: "default" });
      const department = departmentField.value!.validateInput({ minChar: 2, maxChar: 60, regex: "default" });
      const id = persIdField.value!.validateInput({ regex: /^#[\d]{5}$/g });
      const workload = workloadField.value!.validateInput({ min: 0, max: 70 });
      const funcs = functionsField.value!.validateInput(1) as Array<string>;

      if (name && lastName && department && id && workload && funcs) {
        const possibleFunctions: Array<IEmployeeFunction> = funcs.map((f) => {
          return { name: f } as IEmployeeFunction;
        });

        const newEmployee: Employee = new Employee(name, lastName, department, id, workload, possibleFunctions);

        store
          .dispatch(ActionTypes.storeEmployee, newEmployee)
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
      saveNewEmployee,
      nameField,
      lastNameField,
      departmentField,
      functionsField,
      workloadField,
      persIdField,
      employeeFunctions,
    };
  },
});
</script>
