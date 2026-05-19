<template>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import type { CreateDeploymentRecordPayload, DeploymentManagementListItem } from '~/types/domain/deployment'
import { validateQuickAssignDeploymentForm } from '~/utils/service-status-validation'
</script>
