<template>
  <div v-if="documents.length">
    <p class="f5 text-bold mt-3">Documents</p>
    <div class="Box Box--condensed mt-2">
      <div
        class="Box-row"
        v-for="doc in documents" :key="doc.path"
      >
        <span><b>{{ doc.name }}</b>&nbsp;&nbsp;</span>
        <span class="Counter ml-1">🗄️ {{ doc.ext }}</span>
        <div class="float-right ">
          <button
            class="btn-octicon btn-octicon-danger v-align-top"
            type="button"
            @click="removeDocument(doc)"
          >
            <Octicon octicon="x" />
          </button>
        </div>
      </div>
    </div>    
  </div>
</template>

<script lang="ts">
import Octicon from '@/components/Octicon.vue'
import { DocumentRef } from "@/classes/document";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: 'ListDocuments',
  components: {
    Octicon
  },
  props: {
    documents: {
      type: Array as PropType<Array<DocumentRef>>,
      required: true
    }
  },
  emits: ['removeDocument'],
  setup(props, { emit })
  {
    const removeDocument = (document: DocumentRef) => emit('removeDocument', document)

    return {
      removeDocument
    }
  }
})
</script>