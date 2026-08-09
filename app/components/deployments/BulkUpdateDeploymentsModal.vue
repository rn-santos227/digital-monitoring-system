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

]);
</script>
