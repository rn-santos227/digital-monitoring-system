<template>

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

</script>