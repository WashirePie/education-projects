<template>
  <!-- Add activity modal -->
  <PrimerModal v-if="show" :displayFooter="true" :displayHeader="false">
    <template v-slot:body>
      <div class="container-md">
        <!-- Title -->
        <div class="Subhead hx_Subhead--responsive mb-5">
          <h1 class="Subhead-heading">Add Activity</h1>
        </div>

        <!-- Form components -->
        <InputFieldText
          ref="activityTitleField"
          inputName="Title"
          inputDescription="Set the title of this activity"
          placeHolder="Title"
        />

        <InputFieldDate
          ref="activityStartDateField"
          inputName="Start date"
          inputDescription="Set the start date of this activity"
          :placeHolder="phase.startDate"
        />

        <InputFieldDate
          ref="activityEndDateField"
          inputName="End date"
          inputDescription="Set the end date of this activity"
          :placeHolder="phase.startDate"
        />

        <InputFieldSelect
          ref="activityResponsibilityField"
          inputName="Responsibility"
          inputDescription="Assign an employee who is responsible for this activity"
          placeHolder="Choose an employee"
          :selectOptions="availableEmployees"
        />

        <!-- Add Activity resources inline form -->
        <p class="f3 text-bold my-4">Activity Resources</p>

        <nav class="UnderlineNav">
          <div class="UnderlineNav-body" role="tablist">
            <button
              class="UnderlineNav-item"
              role="tab"
              type="button"
              @click="toggleResourceType = true"
              :aria-selected="toggleResourceType"
            >
              Personnel
            </button>
            <button
              class="UnderlineNav-item"
              role="tab"
              type="button"
              @click="toggleResourceType = false"
              :aria-selected="!toggleResourceType"
            >
              External Cost
            </button>
          </div>
        </nav>

        <!-- Resource fields -->
        <div class="d-flex Box Box-header pl-4">
          <div class="flex-1">
            <FieldPersonnelResource v-if="toggleResourceType" :resources="resources" />
            <FieldExternalCostResource v-else :resources="resources" />
          </div>

          <!-- Resources list -->
          <div class="flex-1">
            <div class="Box mt-2">
              <div class="Box-row" v-for="rsc in resources" :key="rsc.title">
                <!-- TODO: sometimes results in a too long string which moves the close button to an awkward spot -->
                <span>{{ rsc.toPlanString() }}</span>
                <div class="float-right">
                  <button class="btn-octicon btn-octicon-danger" type="button" @click="removeResource(rsc)">
                    <Octicon octicon="x" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 'Add' activity docs button -->
        <button class="btn mt-3" type="button" @click="addDocuments">
          <Octicon octicon="plus" />
          <span>Add Documents</span>
        </button>

        <ListDocuments :documents="documents" @removeDocument="removeDocument" />
      </div>
    </template>

    <template v-slot:footer>
      <div class="container-md">
        <!-- Error message -->
        <p class="note text-red my-2" v-if="errorMessage">{{ errorMessage }}</p>

        <!-- Save / cancel buttons -->
        <button class="btn btn-primary mr-2" type="button" @click="savePlannedActivity">
          <Octicon octicon="plus" />
          <span>Add Activity</span>
        </button>

        <button class="btn btn-danger mr-2" type="button" @click="$emit('discard')">
          <Octicon octicon="trash" />
          <span>Discard</span>
        </button>
      </div>
    </template>
  </PrimerModal>
</template>

<script lang="ts">
import InputFieldText from "@/components/InputFieldText.vue";
import InputFieldDate from "@/components/InputFieldDate.vue";
import FieldPersonnelResource from "@/components/FieldPersonnelResource.vue";
import FieldExternalCostResource from "@/components/FieldExternalCostResource.vue";
import InputFieldSelect, { ISelectItem } from "@/components/InputFieldSelect.vue";
import ListDocuments from "@/components/ListDocuments.vue";
import Octicon from "@/components/Octicon.vue";
import { Phase } from "@/classes/phase";
import { computed, ComputedRef, defineComponent, PropType, ref } from "vue";
import { Employee } from "@/classes/employee";
import { useStore } from "@/store";
import { IResource } from "@/classes/resource";
import { DocumentRef } from "@/classes/document";

export default defineComponent({
  name: "ModalFormPlanActivity",
  components: {
    InputFieldText,
    InputFieldDate,
    InputFieldSelect,
    FieldPersonnelResource,
    FieldExternalCostResource,
    ListDocuments,
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
  },
  emits: ["discard", "done"],
  setup(props, { emit }) {
    const store = useStore();

    const activityTitleField = ref<InstanceType<typeof InputFieldText>>();
    const activityStartDateField = ref<InstanceType<typeof InputFieldDate>>();
    const activityEndDateField = ref<InstanceType<typeof InputFieldDate>>();
    const activityResponsibilityField = ref<InstanceType<typeof InputFieldSelect>>();

    const errorMessage = ref<string>("");
    const toggleResourceType = ref<boolean>(false);
    const resources = ref<Array<IResource>>([]);
    const documents = ref<Array<DocumentRef>>([]);

    const addDocuments = async () => {
      let selected: Array<DocumentRef> = await DocumentRef.promptSelection();
      documents.value = [...documents.value, ...selected].filter(
        (v, i, a) => a.findIndex((t) => t.path === v.path) === i
      );
    };
    const removeDocument = (document: DocumentRef) => {
      documents.value = documents.value.filter((d) => d.path != document.path);
    };

    const availableEmployees: ComputedRef<Array<ISelectItem>> = computed(() => {
      const employees: Array<Employee> = store.state.employees;
      const mapped: Array<ISelectItem> = employees.map((e) => {
        return { name: `${e.fullName}`, payload: e } as ISelectItem;
      });

      return mapped;
    });

    const removeResource = (resource: IResource) => {
      resources.value = resources.value.filter((r) => r.title != resource.title);
    };

    const savePlannedActivity = () => {
      const title = activityTitleField.value!.validateInput({ minChar: 2, maxChar: 60, regex: "default" });
      const startDate = activityStartDateField.value!.validateInput({ minDate: props.phase.startDate });
      const endDate = activityEndDateField.value!.validateInput({ minDate: startDate });
      const responsibility = activityResponsibilityField.value!.validateInput();

      if (title && startDate && endDate && responsibility && resources.value) {
        try {
          props.phase.addActivity(
            title,
            startDate,
            endDate,
            resources.value,
            responsibility,
            documents.value as Array<DocumentRef>
          );
          errorMessage.value = "";
          emit("done");
        } catch (error) {
          errorMessage.value = error.message;
        }
      }
    };

    return {
      errorMessage,
      toggleResourceType,
      resources,
      addDocuments,
      removeDocument,
      documents,
      activityTitleField,
      activityStartDateField,
      activityEndDateField,
      activityResponsibilityField,
      availableEmployees,
      savePlannedActivity,
      removeResource,
    };
  },
});
</script>