<template>
  <!-- Add Milestone modal -->
  <PrimerModal v-if="show" :displayFooter="true" :displayHeader="false">
    <template v-slot:body>
      <div class="container-md">
        <!-- Milestone is evaluatable -->
        <div v-if="phase.getMilestoneEvaluatable(milestone)">
          <!-- Title -->
          <div class="Subhead hx_Subhead--responsive mb-5">
            <h1 class="Subhead-heading">
              Evaluate Milestone '<b>{{ milestone.name }}</b
              >'
            </h1>
          </div>

          <p class="note my-2">Watched activities Progress</p>
          <MilestoneProgress :milestone="milestone" :phase="phase" />

          <!-- Resources summary -->
          <p class="f3 text-bold my-4">Milestone overview</p>
          <div
            class="Box Box--condensed my-2"
            v-for="activity in phase.getMilestoneActivities(milestone)"
            :key="activity.aId"
          >
            <div class="Box-header">{{ activity.title }}</div>
            <div class="Box-row" v-for="resource in activity.resources" :key="resource.title">
              <p :class="resource.actual >= resource.plan ? 'text-red' : ''">
                <b>{{ resource.title }}</b>
                {{ resource.getSummary() }}
              </p>
            </div>
          </div>

          <p class="f3 text-bold my-4">Resolve</p>

          <p class="f5 mt-3 d-block">Resolve this milestone evaluation as either of the following:<br /></p>
          <ul>
            <li>Continue, which marks this milestone as completed</li>
            <li>Rework, which sets all of the 'plan' values of the affected resources to their 'actual' value + 10%</li>
            <li>Cancel, which locks this projects and marks it as 'Cancelled'</li>
          </ul>

          <!-- Milestone eval buttons -->
          <div class="my-4">
            <button class="btn btn-sm btn-primary mr-2" type="button" @click="setAsContinued">Continue</button>
            <button class="btn btn-sm btn-danger mr-2" type="button" @click="setAsCancelled">
              Cancel Project Execution
            </button>
            <button class="btn btn-sm btn-outline" type="button" @click="setAsReworked">Rework</button>
          </div>
        </div>

        <p v-else>Milestone is not yet evaluatable</p>
      </div>
    </template>

    <template v-slot:footer>
      <div class="container-md">
        <!-- 'Close' button -->
        <button class="btn mr-2" type="button" @click="close">
          <span>Close</span>
        </button>
      </div>
    </template>
  </PrimerModal>
</template>

<script lang="ts">
import MilestoneProgress from "./MilestoneProgress.vue";
import Octicon from "@/components/Octicon.vue";
import { Phase } from "@/classes/phase";
import { defineComponent, PropType } from "vue";
import { EMilestoneState, Milestone } from "@/classes/milestone";

export default defineComponent({
  name: "ModalFormManageMilestone",
  components: {
    MilestoneProgress,
    Octicon,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    phase: {
      type: Object as PropType<Phase>,
      required: true,
    },
    milestone: {
      type: Object as PropType<Milestone>,
      required: true,
    },
  },
  emits: ["discard", "done", "cancelProject"],
  setup(props, { emit }) {
    const setAsContinued = () => {
      props.phase.setMilestoneState(props.milestone, EMilestoneState.continued);
      emit("done");
    };

    const setAsReworked = () => {
      props.phase.setMilestoneState(props.milestone, EMilestoneState.reworked);
      emit("done");
    };

    const setAsCancelled = () => {
      props.phase.setMilestoneState(props.milestone, EMilestoneState.cancelled);
      emit("cancelProject");
    };

    const close = () => emit("done");

    return {
      close,
      setAsContinued,
      setAsReworked,
      setAsCancelled,
    };
  },
});
</script>