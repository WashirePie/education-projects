<template>
  <div v-if="employees.length">
    <h3 class="f3-light my-2">Employees</h3>

    <div class="Box mt-2">
      <div class="Box-row" v-for="emp in employees" :key="emp.eId">
        <Octicon octicon="person" class="circle d-inline mt-1 mr-2" />
        <span class="mr-2">{{ emp.fullName }}</span>
        <span class="Label Label--gray mr-2">🏬 {{ emp.department }}</span>
        <span class="Label mr-1 Label--purple" v-for="empFn in emp.possibleFunctions" :key="empFn">
          {{ empFn }}
        </span>
        <div class="float-right">
          <span class="Label Label--gray">🗝️ {{ emp.eId }} </span>
          <button class="btn-octicon btn-octicon-danger v-align-top" type="button" @click="removeEmployee(emp)">
            <Octicon octicon="x" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Octicon from "@/components/Octicon.vue";
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { Employee } from "@/classes/employee";

export default defineComponent({
  name: "ListEmployees",
  components: {
    Octicon,
  },
  emits: ["removeEmployee"],
  setup(props, { emit }) {
    const store = useStore();

    const employees: ComputedRef<Array<Employee>> = computed(() => store.state.employees);

    const removeEmployee = (employee: Employee) => emit("removeEmployee", employee);

    return {
      employees,
      removeEmployee,
    };
  },
});
</script>