<template>
  <div v-if="approachModels.length">
    <h3 class="f3-light my-2">Approach Models</h3>

    <div class="Box Box--condensed mt-2">
      <div class="Box-row d-flex flex-items-top flex-justify-between" v-for="amp in approachModels" :key="amp.title">
        <details class="details-reset">
          <summary class="btn-octicon">
            <Octicon octicon="package" class="circle d-inline mr-2" />
            <span class="d-inline mr-2"
              ><b>{{ amp.title }}</b></span
            >
            <Octicon octicon="chevron-down" />
          </summary>
          <div class="width-full p-3">
            <p class="d-block note" v-for="ampPh in amp.phases" :key="ampPh">
              {{ ampPh }}
            </p>
          </div>
        </details>
        <div>
          <button class="btn-octicon btn-octicon-danger v-align-top" type="button" @click="removeApproachModel(amp)">
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
import { ApproachModel } from "@/classes/approachModel";

export default defineComponent({
  name: "ListApproachModels",
  components: {
    Octicon,
  },
  emits: ["removeApproachModel"],
  setup(props, { emit }) {
    const store = useStore();

    const approachModels: ComputedRef<Array<ApproachModel>> = computed(() => store.state.approachModels);

    const removeApproachModel = (model: ApproachModel) => emit("removeApproachModel", model);

    return {
      approachModels,
      removeApproachModel,
    };
  },
});
</script>