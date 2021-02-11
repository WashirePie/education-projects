<template>
  <div class="container-xl my-5 px-3 px-md-4 px-lg-5">
    <button
      class="btn btn-primary mr-2"
      type="button"
      @click="showModal = true"
    >Plan a new Project</button>

    <button
      class="btn btn-primary mr-2"
      type="button"
      @click="load"
    >Start</button>  

    <button
      class="btn btn-primary mr-2"
      type="button"
      @click="finish"
    >Finish</button>

    <button
      class="btn btn-primary mr-2"
      type="button"
      @click="fifty"
    >50%</button>
  </div>
  <PrimerModal
    v-if="showModal"
    @close="showModal = false"  
  >
    <template v-slot:body>
      <FormNewProject />
    </template>
  </PrimerModal>


</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import FormNewProject from '@/views/FormNewProject.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    FormNewProject
  },
  setup() 
  {
    const store = useStore()
    const showModal = ref(true)

    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar

    const load = () => loadingbar.start()
    const finish = () => loadingbar.finish()
    const fifty = () => loadingbar.update(50)

    return { showModal, load, finish, fifty }
  }
})
</script>

<style lang="scss">
</style>
