<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import EntityDetailCard from '~/components/general/EntityDetailCard.vue'
import InfiniteCardGrid from '~/components/general/InfiniteCardGrid.vue'
import { PERSONNEL_TABLE_ACTIONS } from '~/constants/table.constants'
import type { DataTableAction } from '~/constants/ui.constants'
import type { PersonnelTableRow } from '~/types/domain/personnel'
</script>
