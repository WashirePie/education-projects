<template>
  <div class="pm-create">
    <br>
    <h3>What would you like to do?</h3>
    <it-toggle
      v-model="toggleValue"
      round
      style="width: 50%; margin: 0 auto"
      :options="toggleOptions"
    />
    <br>
    <div class="pm-create-form">
      <it-divider />
      <transition
        appear
        name="fade"
        mode="out-in"
      >
        <CreateProject
          v-if="toggleValue == 'Project'"
          key="Project"
        />
        <CreateApproachModel
          v-else-if="toggleValue == 'Approach Model'"
          key="Approach Model"
        />
        <CreateEmployee
          v-else-if="toggleValue == 'Employee'"
          key="Employee"
        />
        <CreateCostCenter
          v-else-if="toggleValue == 'Cost Center'"
          key="Cost Center"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import CreateApproachModel from './CreateForms/CreateApproachModel.vue'
import CreateEmployee from './CreateForms/CreateEmployee.vue'
import CreateCostCenter from './CreateForms/CreateCostCenter.vue'
import CreateProject from './CreateForms/CreateProject.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: {
    CreateApproachModel,
    CreateEmployee,
    CreateCostCenter,
    CreateProject
  },
  setup ()
  {
    const toggleOptions = ref(['Project', 'Approach Model', 'Employee', 'Cost Center'])
    const toggleValue = ref(toggleOptions.value[1])
    return { toggleValue, toggleOptions }
  }
})
</script>

<style lang="scss">
.pm-create-form {
  width: 60%;
  margin: 20px auto;

  h2, h3 {
    text-align: left;
  }

  h3 {
    margin-bottom: 10px;
  }

  p {
    text-align: left;
    display: block;
    font-size: 14px;
    color: $color-font-main;
    margin-bottom: 7px;
  }
}
</style>
