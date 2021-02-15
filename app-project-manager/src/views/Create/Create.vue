<template>
  <!-- Form navigator -->
  <nav
    class="UnderlineNav"
    aria-label="New"
  >
    <div class="UnderlineNav-body">
      <a class="UnderlineNav-item"
        v-for="form in forms" :key="form.name"
        v-on:click="select(form)"
        :aria-current="form.isCurrent"
      >
        {{ form.name }}</a>
    </div>
  </nav>

  <!-- Main container -->
  <div class="container-lg my-6 px-lg-5">
      
      <!-- Forms -->
      <FormNewApproachModel
        v-if="forms[0].isCurrent"
        ref="formApproachModel"
      />

      <FormNewEmployee
        v-if="forms[1].isCurrent"
        ref="formEmployee"
      />

      <FormNewCostCenter
        v-if="forms[2].isCurrent"
        ref="formCostCenter"
      />

      <hr>

      <!-- Store button -->
      <button
        class="btn btn-primary mr-2"
        type="button"
        @click="validateCurrentForm"
      >
        <PrimerIcon octicon="download" />
        <span>Store</span>
      </button>
  </div>

</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, Ref, ref } from 'vue'
import FormNewApproachModel from './FormNewApproachModel.vue'
import FormNewEmployee from './FormNewEmployee.vue'
import FormNewCostCenter from './FormNewCostCenter.vue'
import PrimerIcon from '@/components/PrimerIcon.vue'

interface PrimerForm {
  name: string;
  isCurrent: boolean;
  component: Ref | null;
}

export default defineComponent({
  name: 'Create',
  components: {
    FormNewApproachModel,
    FormNewEmployee,
    FormNewCostCenter,
    PrimerIcon
  },
  setup()
  {
    // Setup references for the form components
    const formApproachModel = ref<Ref | null>(null)
    const formEmployee      = ref<Ref | null>(null)
    const formCostCenter    = ref<Ref | null>(null)

    const loadingbar = getCurrentInstance()?.appContext.config.globalProperties.$Loadingbar

    const forms = reactive<PrimerForm[]>([
      { name: 'Approach Model', isCurrent: true,  component: formApproachModel  },
      { name: 'Employee',       isCurrent: false, component: formEmployee },
      { name: 'Cost Center',    isCurrent: false, component: formCostCenter }
    ])

    const validateCurrentForm = () =>
    {
      const currentForm = forms.filter(f => f.isCurrent)[0].component

      loadingbar.start()
      
      currentForm.validateForm()
        .then((res: string) => console.log(res))
        .catch((err: string) => console.log(err))
        .finally(() => loadingbar.finish())      
    }

    const select = (form: PrimerForm) =>
    {
      forms.forEach(f => f.isCurrent = false)
      form.isCurrent = true
    }

    return { 
      forms, 
      select, 
      validateCurrentForm, 
      formApproachModel, 
      formEmployee, 
      formCostCenter 
    }
  }
})

</script>
