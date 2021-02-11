<template>

  <teleport to="#modal">
        <div 
          class="modal-mask"
          ref="modalMask"
        >
          <div class="Box Box--overlay mx-6 my-5 d-flex flex-column modal-restrict">
            <div class="Box-header p-1 bg-white">
              <button 
                class="btn-octicon btn-octicon-danger float-right" 
                type="button" 
                @click="closeModal"
              >
                <XIcon class="octicon-x"/>
              </button>

              <slot name="header">
              </slot>
            </div>

            <div class="Box-body overflow-auto">

              <slot name="body">
                Example Body
              </slot>
            </div>

            <div 
              class="Box-footer"
              v-if="displayFooter"
            >
              <slot name="footer">
                <button type="button" class="btn">Example Footer Button</button>
              </slot>
            </div>

          </div>
        </div>  
  </teleport>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import XIcon from '@/components/octicons/XIcon.vue'

export default defineComponent({
  components: {
    XIcon
  },
  props: {
    displayFooter: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit })
  {
    const closeModal = () => emit('close')

    return { closeModal }
  }
})
</script>

<style>

.modal-mask
{
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  /* display: table; */
}

.modal-restrict
{
  max-height: 90% !important;
}

</style>