<template>

  <!-- Name field -->
  <div>
    <InputFieldText
      ref="nameField"
      inputName="Resource Name"
      inputDescription="Set the name of this external cost resource"
      placeHolder="Resource name"
    />
  </div>

  <!-- Cost type select -->
  <div>
    <div class="form-group">
      <div class="form-group-header">
        <label>Cost Type</label>
      </div>
      <span class="text-small text-gray">Select a cost type</span>
    </div>

    <div class="form-group-body">
      <select
        v-model="costTypeValue"
        class="form-select"
      >
        <option
          v-for="cc in costTypes" :key="cc.id" 
          :value="cc"
        >
          {{ cc.id }}: {{ cc.title }} 
        </option>
      </select>
    </div>
  </div>

  <!-- Cost field -->
  <div>
    <InputFieldNumber
      ref="costPlanField"
      inputName="Cost (PLAN)"
      inputDescription="Set the planned cost (CHF)"
      :placeHolder="0"
    />
  </div>

  <!-- 'Add' button -->
  <div class="py-2">
    <p
      class="note text-red"
      v-if="errorMessage"
    >{{ errorMessage }}</p>

    <button
      class="btn d-block mt-3"
      type="button"
      @click="addResource"
    >
      <Octicon octicon="plus" />
      <span>Add</span>
    </button>
  </div>


</template>

<script lang="ts">
import Octicon from '@/components/Octicon.vue'
import InputFieldText from '@/components/InputFieldText.vue'
import InputFieldNumber from '@/components/InputFieldNumber.vue'
import { CostType } from "@/classes/costType";
import { ExternalCostResource, IResource } from "@/classes/resource";
import { useStore } from "@/store";
import { computed, ComputedRef, defineComponent, onMounted, PropType, ref, watch } from "vue";

export default defineComponent({
  name: 'FieldResources',
  components: {
    Octicon,
    InputFieldText,
    InputFieldNumber
  },
  props: {
    resources: {
      type: Object as PropType<Array<IResource>>,
      required: true
    }
  },
  setup(props) 
  {
    const store = useStore()

    const nameField             = ref<InstanceType<typeof InputFieldText>>()
    const costPlanField         = ref<InstanceType<typeof InputFieldNumber>>()

    const errorMessage          = ref<string>('')
    const costTypeValue         = ref<CostType>()
    const costErrorMessage      = ref<string>('')
    const externalCostResources = ref<Array<ExternalCostResource>>([])
    const costTypes: ComputedRef<Array<CostType>> = computed(() => store.state.costTypes )

    // Set default values on mounted
    onMounted(() => { costTypeValue.value = costTypes.value[0] })

    // Reset Error messages when typing continues
    watch(costPlanField, () => costErrorMessage.value = "")

    const addResource = () =>
    {
      errorMessage.value = ''
      
      const title = nameField.value?.validateInput({ minChar: 2, maxChar: 60, regex: 'default', duplicatesArray: [...props.resources.map(r => r.title)] })
      const cost = costPlanField.value?.validateInput({ min: 1, max: 1e5})

      if (title && cost)
      {
        const newExternalCostResource = new ExternalCostResource(
          title,
          cost,
          costTypeValue.value!
        )
        
        props.resources.push(newExternalCostResource)
      }
    }
    
    return {
      addResource,
      errorMessage,
      costErrorMessage,
      costTypeValue,
      costTypes,
      costPlanField,
      nameField,
      externalCostResources,
    }
  }
})
</script>