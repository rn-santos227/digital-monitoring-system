<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  DEPLOYMENT_RECORDS_TABLE_COLUMNS,
  DEPLOYMENT_RECORDS_TABLE_EMPTY_MESSAGE,
  DEPLOYMENT_RECORDS_TABLE_TITLE,
  DEPLOYMENTS_TABLE_ACTIONS_COLUMN_LABEL,
} from '~/constants/table.constants'
import { DEPLOYMENT_PRIVILEGES } from '~/constants/privileges.constants'
import { useAuthStore } from '~/stores/auth'
</script>