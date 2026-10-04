<template>
  <BaseModal
    :title="DEPLOYMENTS_BULK_UPDATE_MODAL_TITLE"
    :description="DEPLOYMENTS_BULK_UPDATE_MODAL_DESCRIPTION"
    size="xl"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert :message="warningMessage || DEPLOYMENTS_BULK_UPDATE_WARNING" tone="warning" />
      <BaseAlert
        v-if="errorMessage || validationError"
        :message="errorMessage || validationError"
        tone="danger"
      />

      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="field in fields"
          :key="field.key"
          class="space-y-2 rounded-lg border border-slate-200 p-3"
        >
          <BaseCheckbox v-model="enabled[field.key]" :label="field.label" />
          <BaseDatePicker
            v-if="field.type === 'date'"
            v-model="form[field.key]"
            :label="field.label"
            :disabled="!enabled[field.key]"
          />
          <BaseTextField
            v-else
            v-model="form[field.key]"
            :label="field.label"
            :placeholder="field.placeholder"
            :disabled="!enabled[field.key]"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">
          Update {{ selectedCount }} selected
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  DEPLOYMENTS_BULK_UPDATE_MODAL_DESCRIPTION,
  DEPLOYMENTS_BULK_UPDATE_MODAL_TITLE,
  DEPLOYMENTS_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { DeploymentBulkUpdateValues } from '~/types/domain/deployment'
import { validateDeploymentBulkUpdate } from '~/utils/bulk-management-validation'

type FieldKey =
  | "deployment_area"
  | "assignment_role"
  | "operation_name"
  | "start_date"
  | "end_date"
  | "location"
  | "default_remarks";

const fields: readonly {
  key: FieldKey;
  label: string;
  placeholder: string;
  type?: "date";
}[] = Object.freeze([
  {
    key: "deployment_area",
    label: "Deployment Area",
    placeholder: "Enter deployment area",
  },
  {
    key: "operation_name",
    label: "Operation Name",
    placeholder: "Enter operation name",
  },
  {
    key: "assignment_role",
    label: "Assignment Role",
    placeholder: "Enter assignment role",
  },
  { key: "location", label: "Location", placeholder: "Enter location" },
  { key: "start_date", label: "Start Date", placeholder: "", type: "date" },
  { key: "end_date", label: "End Date", placeholder: "", type: "date" },
  {
    key: "default_remarks",
    label: "Default Remarks",
    placeholder: "Enter remarks",
  },
]);

withDefaults(
  defineProps<{
    selectedCount: number
    isSubmitting?: boolean
    errorMessage?: string
    warningMessage?: string
  }>(),
  {
    isSubmitting: false,
    errorMessage: "",
    warningMessage: '',
  },
);

const emit = defineEmits<{
  (event: "close"): void;
  (event: "submit", payload: DeploymentBulkUpdateValues): void;
}>();

const form = reactive<Record<FieldKey, string>>({
  deployment_area: "",
  assignment_role: "",
  operation_name: "",
  start_date: "",
  end_date: "",
  location: "",
  default_remarks: "",
});

const enabled = reactive<Record<FieldKey, boolean>>({
  deployment_area: false,
  assignment_role: false,
  operation_name: false,
  start_date: false,
  end_date: false,
  location: false,
  default_remarks: false,
});
const validationError = ref("");

const onSubmit = () => {
  const result = validateDeploymentBulkUpdate({
    fields: fields.map((field) => field.key),
    form,
    enabled,
  });
  validationError.value = result.error;

  if (result.payload) {
    emit("submit", result.payload);
  }
};
</script>
