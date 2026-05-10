<template>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import { validateCreateDeploymentRecordForm } from '~/utils/deployment-validation'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'
</script>
