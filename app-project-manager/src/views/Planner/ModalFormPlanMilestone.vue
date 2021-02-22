<template>

  <!-- Add Milestone modal -->
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
            Add Milestone
          </h1>
        </div>

        <!-- Form components -->
        <InputFieldText
          ref="milestoneNameField"
          inputName="Name"
          inputDescription="Set the name of this milestone"
          placeHolder="Name"
        />

        <InputFieldOptions
          ref="milestoneReferencedActivitiesField"
          inputName="Referenced Activities"
          inputDescription="Select the activities this milestone should evaluate"
          :inputSource="phaseActivities"
        />

        <InputFieldDate
          ref="milestoneReviewDateField"
          inputName="Review date"
          inputDescription="Set the review date of this milestone."
          :placeHolder="phase.endDate"
        />

      </div>
    </template>

    <template v-slot:footer>

      <div class="container-md">
        <!-- Error message -->
        <p
          class="note text-red my-2"
          v-if="errorMessage"
        >{{ errorMessage }}</p>
        
        <!-- Save / cancel buttons -->
        <button
          class="btn btn-primary mr-2"
          type="button"
          @click="savePlannedMilestone"
        >
          <Octicon octicon="plus" />
          <span>Add Milestone</span>
        </button>

        <button
          class="btn btn-danger mr-2"
          type="button"
          @click="$emit('discard')"
        >
          <Octicon octicon="trash" />
          <span>Discard</span>
        </button>
      </div>

    </template>

  </PrimerModal>

</template>

<script lang="ts">
import InputFieldText from '@/components/InputFieldText.vue'
import InputFieldDate from '@/components/InputFieldDate.vue'
import InputFieldOptions, { IOptionItem } from '@/components/InputFieldOptions.vue'
import InputFieldSelect from '@/components/InputFieldSelect.vue'
import Octicon from '@/components/Octicon.vue'
import { Phase } from "@/classes/phase";
import { computed, ComputedRef, defineComponent, PropType, ref } from "vue";
import { Activity } from '@/classes/activity'

export default defineComponent({
  name: 'ModalFormPlanMilestone',
  components: {
    InputFieldText,
    InputFieldDate,
    InputFieldSelect,
    InputFieldOptions,
    Octicon
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    phase: {
      type: Object as PropType<Phase>,
      required: true
    }
  },
  emits: ['discard', 'done'],
  setup(props, { emit }) 
  {
    const milestoneNameField                 = ref<InstanceType<typeof InputFieldText>>()
    const milestoneReviewDateField           = ref<InstanceType<typeof InputFieldDate>>()
    const milestoneReferencedActivitiesField = ref<InstanceType<typeof InputFieldOptions>>()

    const errorMessage = ref<string>('')

    const phaseActivities: ComputedRef<Array<IOptionItem>> = computed(() =>
    {
      const activities: Array<Activity> = props.phase.activities
      const mapped: Array<IOptionItem> = activities.map(f => 
      {
        return { name: f.title, payload: f.id, note: `${f.responsibility.fullName} / ${f.startDate.toLocaleDateString()} - ${f.endDate.toLocaleDateString()}`, state: false } as IOptionItem
      })
      return mapped
    })   

    const savePlannedMilestone = () =>
    {
      const name       = milestoneNameField.value!.validateInput({ minChar: 2, maxChar: 60, regex: 'default', duplicatesArray: [...props.phase.milestones.map(m => m.name)]})  
      const reviewDate = milestoneReviewDateField.value!.validateInput({ minDate: props.phase.startDate })
      const activities = milestoneReferencedActivitiesField.value!.validateInput(1)

      if (name && reviewDate && activities)
      {
        const watchActivities: Array<string> = activities as Array<string>

        try
        {
          props.phase.addMilestone(name, reviewDate, watchActivities)
          errorMessage.value = ''
          emit('done')
        }
        catch (error)
        {
          errorMessage.value = error.message
        }
      }
    }

    return {
      errorMessage,
      phaseActivities,
      milestoneNameField,
      milestoneReviewDateField,
      milestoneReferencedActivitiesField,
      savePlannedMilestone,
    }
  }
})
</script>