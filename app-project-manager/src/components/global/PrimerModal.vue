<template>
  <!-- Modal teleport -->
  <teleport to="#modal">
    <!-- Modal overlay -->
    <div class="modal-mask" ref="modalMask">
      <!-- Main container -->
      <div class="Box Box--overlay my-5 container-lg d-flex flex-column modal-restrict">
        <!-- Modal header -->
        <div class="Box-header p-1 bg-white" v-if="displayHeader">
          <button class="btn-octicon btn-octicon-danger float-right" type="button" @click="closeModal">
            <Octicon octicon="x" class="octicon-x" />
          </button>

          <slot name="header"></slot>
        </div>

        <!-- Modal body -->
        <div class="Box-body overflow-auto">
          <slot name="body"> Example Body </slot>
        </div>

        <!-- Modal footer -->
        <div class="Box-footer" v-if="displayFooter">
          <slot name="footer">
            <button type="button" class="btn">Example Footer Button</button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import Octicon from "@/components/Octicon.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Octicon,
  },
  props: {
    displayFooter: {
      type: Boolean,
      default: false,
    },
    displayHeader: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const closeModal = () => emit("close");

    return {
      closeModal,
    };
  },
});
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
}

.modal-restrict {
  max-height: 90% !important;
}
</style>