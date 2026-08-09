<template>

</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  DEPLOYMENTS_BULK_UPDATE_MODAL_DESCRIPTION,
  DEPLOYMENTS_BULK_UPDATE_MODAL_TITLE,
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
    selectedCount: number;
    isSubmitting?: boolean;
    errorMessage?: string;
  }>(),
  {
    isSubmitting: false,
    errorMessage: "",
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
</script>
