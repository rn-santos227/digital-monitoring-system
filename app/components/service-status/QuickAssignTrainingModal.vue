<template>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import TrainingSuggestionField from '~/components/general/TrainingSuggestionField.vue'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'
import { validateQuickAssignTrainingForm } from '~/utils/service-status-validation'
</script>
