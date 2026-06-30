<template>

</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useRouter } from '#imports'
import { SEARCH_API_ENDPOINTS } from '~/constants/api.constants'
import { DASHBOARD_SEARCH_PLACEHOLDER } from '~/constants/navigation.constants'
import type { GlobalSearchSuggestionItem, GlobalSearchSuggestionResponse, GlobalSearchSuggestionDomain } from '~/types/domain/global-search'

const MINIMUM_SEARCH_LENGTH = 2
const SEARCH_DEBOUNCE_MS = 250
</script>

<style scoped>
:deep(.general-search-field input) {
  padding-left: 2.5rem;
}
</style>
