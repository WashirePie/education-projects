<template>
  <div v-if="costTypes.length">
    <h3 class="f3-light my-2">Cost Types</h3>

    <div class="Box Box--condensed mt-2">
      <div class="Box-row d-flex flex-items-center flex-justify-between" v-for="ct in costTypes" :key="ct.title">
        <span>{{ ct.title }}</span>

        <div>
          <span class="Label Label--gray">🗝️ {{ ct.cId }} </span>
          <button class="btn-octicon btn-octicon-danger v-align-top" type="button" @click="removeCostType(ct)">
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
import { CostType } from "@/classes/costType";

export default defineComponent({
  name: "ListCostTypes",
  components: {
    Octicon,
  },
  emits: ["removeCostType"],
  setup(props, { emit }) {
    const store = useStore();

    const costTypes: ComputedRef<Array<CostType>> = computed(() => store.state.costTypes);

    const removeCostType = (costType: CostType) => emit("removeCostType", costType);

    return {
      costTypes,
      removeCostType,
    };
  },
});
</script>