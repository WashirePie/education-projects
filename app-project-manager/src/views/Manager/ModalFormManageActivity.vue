<template>

  <!-- Add activity modal -->
  <PrimerModal
    v-if="show"
    :displayFooter="true"
    :displayHeader="false"
  >
    <template v-slot:body>
      <div class="container-md">
        <!-- Title -->
        <div class="Subhead hx_Subhead--responsive mb-5">
          <h1 class="Subhead-heading ">
            Manage Activity '<b>{{ activity.title }}</b>'
          </h1>
        </div>

        <!-- Activity Progress field -->
        <p class="note">
          Current Progress {{ activity.progress.toFixed(0) }}%
        </p>
        <span class="Progress Progress--small">
          <span 
            class="Progress-item bg-green" 
            :style="{width: activity.progress + '%'}"
          >
          </span>
        </span>

        <div class="mt-2">
          <p class="d-inline mr-1">Progress is at</p>
          <input
            v-model="activity.progress"
            class="form-control input-sm d-inline mr-1"
            style="width: 50px;"
            type="number"
          >
          <p class="d-inline">%</p>
        </div>

        <!-- Activity resources -->
        <p class="f3 text-bold my-4">Manage Activity Resources</p>

        <div class="Box Box--condensed">

          <!-- Resources List  -->
          <div
            class="Box-row"
            v-for="rsc in activity.resources" :key="rsc.title"
          >
            <p class="d-block">{{ rsc.hasOwnProperty('assignee') ? '⌛ Personell Resource \'' : '💰 External Cost Resource \''}}<b>{{ rsc.title }}</b>'</p>
            <p class="d-inline"> Used </p>
            <input 
              v-model="rsc.actual"
              class="form-control input-sm d-inline"
              :class="rsc.actual > rsc.plan ? 'border-yellow' : 'border-green'"
              style="width: 73px;"
              type="number"
            >
            <p class="d-inline"> of {{ rsc.plan }} {{ rsc.unit }}</p>
            <input 
              v-if="rsc.actual > rsc.plan"
              v-model="rsc.deviation"
              class="form-control input-sm input-block mt-2 border-yellow"
              placeholder="Deviation explanation..."
              type="string"
            >
          </div>
        </div>

        <!-- DocumentRefs list -->
        <ListDocuments
        :documents="activity.documents"
        @removeDocument="removeDocument"
        />

        <!-- 'Add' Documents buttons -->
        <button
          class="btn mt-4"
          type="button"
          @click="activity.addDocuments()"
        >
          <Octicon octicon="plus" />
          <span>Add Activity Documents</span>
        </button>

      </div>
    </template>

    <template v-slot:footer>

      <div class="container-md">
        <!-- Error message -->
        <p
          class="note text-red my-2"
          v-if="errorMessage"
        >{{ errorMessage }}</p>
        
        <!-- Finish button -->
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="finish"
        >
          <span>Finish</span>
        </button>

      </div>

    </template>

  </PrimerModal>

</template>

<script lang="ts">
import ListDocuments from '@/components/ListDocuments.vue'
import Octicon from '@/components/Octicon.vue'
import { defineComponent, PropType, ref } from "vue";
import { Activity } from '@/classes/activity';
import { DocumentRef } from '@/classes/document';

export default defineComponent({
  name: 'ModalFormPlanActivity',
  components: {
    ListDocuments,
    Octicon
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    activity: {
      type: Object as PropType<Activity>,
      required: true
    }
  },
  emits: ['discard', 'done'],
  setup(props, { emit }) 
  {
    const errorMessage       = ref<string>('')
    const toggleResourceType = ref<boolean>(false)

    const removeDocument = (document: DocumentRef) => props.activity.removeDocument(document)

    const finish = () => emit('done')

    return {
      errorMessage,
      toggleResourceType,
      removeDocument,
      finish,
    }
  }
})
</script>