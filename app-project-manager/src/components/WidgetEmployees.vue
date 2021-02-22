<template>

  <div v-if="employees.length">

    <h3 class="f3-light my-2">Employees</h3>
    
    <div class="Box mt-2">
      <div
        class="Box-row"
        v-for="emp in employees" :key="emp.id"
      >
        <Octicon octicon="person" class="circle d-inline mt-1 mr-2" />
        <span><b>{{ emp.fullName }}</b>&nbsp;&nbsp;</span>
        <span class="Label Label--gray-darker mr-2">🗝️ {{ emp.id }} </span> 
        <span class="Counter mr-2">🏬 {{ emp.department }}</span>
        <span 
          class="Label mr-1 Label--purple"
          v-for="empFn in emp.possibleFunctions" :key="empFn.name"
        >
          {{ empFn.name }}
        </span>
      </div>
    </div>   
     
  </div>

</template>

<script lang="ts">
import Octicon from '@/components/Octicon.vue'
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { Employee } from '@/classes/employee';

export default defineComponent({
  name: 'WidgetEmployees',
  components: {
    Octicon
  },
  setup() 
  {
    const store = useStore()

    const employees: ComputedRef<Array<Employee>> = computed(() => store.state.employees )

    return {
      employees
    }
  }
})
</script>