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
        <span class="Label Label--gray float-right">🗝️ {{ emp.eId }} </span>
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
  setup() {
    const store = useStore();

    const employees: ComputedRef<Array<Employee>> = computed(() => store.state.employees);

    return {
      employees,
    };
  },
});
</script>