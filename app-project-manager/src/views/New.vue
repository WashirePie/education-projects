<template>

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

  <div class="container-md my-6 px-3 px-md-4 px-lg-5">
      <FormNewApproachModel
        v-if="forms[0].isCurrent"
        ref="formApproachModel"
      />
      <FormNewProject
        v-if="forms[1].isCurrent"
        ref="formProject"
      />
      <FormNewEmployee
        v-if="forms[2].isCurrent"
        ref="formEmployee"
      />
      <FormNewCostCenter
        v-if="forms[3].isCurrent"
        ref="formCostCenter"
      />

      <hr>

      <button
        class="btn btn-primary mr-2"
        type="button"
        @click="validateCurrentForm"
      >Store</button>
  </div>

</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref } from 'vue'
import FormNewApproachModel from './FormNewApproachModel.vue'
import FormNewProject from './FormNewProject.vue'
import FormNewEmployee from './FormNewEmployee.vue'
import FormNewCostCenter from './FormNewCostCenter.vue'

interface PrimerForm {
  name: string;
  isCurrent: boolean;
  component: Ref | null;
}

export default defineComponent({
  components: {
    FormNewApproachModel,
    FormNewProject,
    FormNewEmployee,
    FormNewCostCenter,
  },
  setup()
  {
    const formApproachModel = ref<Ref | null>(null)
    const formProject = ref<Ref | null>(null)
    const formEmployee = ref<Ref | null>(null)
    const formCostCenter = ref<Ref | null>(null)

    /* eslint-disable no-multi-spaces */
    const forms = reactive<PrimerForm[]>([
      { name: 'Approach Model', isCurrent: true,  component: formApproachModel  },
      { name: 'Project',        isCurrent: false, component: formProject },
      { name: 'Employee',       isCurrent: false, component: formEmployee },
      { name: 'Cost Center',    isCurrent: false, component: formCostCenter }
    ])

    const validateCurrentForm = () =>
    {
      // TODO: Wire up all Forms to their respective store
      const currentForm = forms.filter(f => f.isCurrent)[0].component
      currentForm.validateForm()
        .then((res: string) => console.log(res))
        .catch((err: string) => console.log(err))
    }

    const select = (form: PrimerForm) =>
    {
      forms.forEach(f => f.isCurrent = false)
      form.isCurrent = true
    }

    return { forms, select, validateCurrentForm, formApproachModel, formProject, formEmployee, formCostCenter }
  }
})

</script>
