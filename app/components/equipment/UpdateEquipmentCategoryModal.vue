<template>

</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useDialog } from '~/composables/useDialog'
import type { UpdateEquipmentCategoryPayload } from '~/types/domain/equipment'
import { validateUpdateEquipmentCategoryForm } from '~/utils/equipment-validation'
import { requestCloseForChangedValues, resetFormValues } from '~/utils/form-close-guard'


</script>
