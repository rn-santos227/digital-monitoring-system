<template>
  <BaseModal
    :title="DEPLOYMENT_RECORDS_BULK_UPDATE_MODAL_TITLE"
    :description="DEPLOYMENT_RECORDS_BULK_UPDATE_MODAL_DESCRIPTION"
    size="xl"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert :message="DEPLOYMENTS_BULK_UPDATE_WARNING" tone="warning" />
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
        </div>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  DEPLOYMENT_RECORDS_BULK_UPDATE_MODAL_DESCRIPTION,
  DEPLOYMENT_RECORDS_BULK_UPDATE_MODAL_TITLE,
  DEPLOYMENTS_BULK_UPDATE_WARNING,
} from "~/constants/page.constants";
import type { DeploymentBulkUpdateValues } from "~/types/domain/deployment";
import { validateDeploymentBulkUpdate } from "~/utils/bulk-management-validation";

type FieldKey =
  | "deployment_area"
  | "assignment_role"
  | "operation_name"
  | "start_date"
  | "end_date"
  | "location"
  | "remarks";

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
  { key: "remarks", label: "Remarks", placeholder: "Enter remarks" },
])

withDefaults(
  defineProps<{
    selectedCount: number;
    isSubmitting?: boolean;
    errorMessage?: string;
  }>(),
  { isSubmitting: false, errorMessage: "" },
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
  remarks: "",
});

const enabled = reactive<Record<FieldKey, boolean>>({
  deployment_area: false,
  assignment_role: false,
  operation_name: false,
  start_date: false,
  end_date: false,
  location: false,
  remarks: false,
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