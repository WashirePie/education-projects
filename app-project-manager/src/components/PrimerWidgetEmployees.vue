<template>

  <h3 class="f3-light my-2">
      All Employees
  </h3>

  <div class="d-flex flex-column">
    <div 
      class="p-3 border rounded-1"
      v-for="emp in employees" :key="emp.id"
    >
      <PersonIcon class="circle d-inlin my-1" />
      
      <p class="f5 d-inline ml-2">
        {{ emp.name }} {{ emp.lastName }} ({{ emp.department }})
      </p>

      <span class="Label Label--gray-darker mx-2 d-inline">
        {{ emp.id }}
      </span> 

      <span 
        class="Label mr-1 Label--purple"
        v-for="empFn in emp.possibleFunctions" :key="empFn.name"
      >
        {{ empFn.name }}
      </span>

    </div>
  </div>

</template>

<script lang="ts">
import PersonIcon from '@/components/octicons/PersonIcon.vue'
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { Employee } from '@/interfaces/employee';

export default defineComponent({
  name: 'PrimerWidgetEmployees',
  components: {
    PersonIcon
  },
  setup() 
  {
    const store = useStore()

    const employees: ComputedRef<Array<Employee>> = computed(() => store.state.employees )
  console.log(employees);
  
    return {
      employees
    }
  }
})
</script>

<style>

</style>