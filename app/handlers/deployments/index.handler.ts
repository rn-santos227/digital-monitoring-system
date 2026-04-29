import type { Ref } from 'vue'
import type { DeploymentManagementSearchQuery, DeploymentManagementTabId } from '~/types/domain/deployment'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const DEPLOYMENT_MANAGEMENT_TAB_IDS: readonly DeploymentManagementTabId[] = ['deployments', 'records']
const DEPLOYMENT_SEARCHABLE_FIELDS = ['operationName', 'deploymentArea', 'status'] as const

export const useDeploymentManagementPageHandlers = (
  activeTab: Ref<DeploymentManagementTabId>,
  deploymentFilters: Ref<Partial<DeploymentManagementSearchQuery>>,
) => {
  const handleTabChange = (nextTab: string) => {
    if (DEPLOYMENT_MANAGEMENT_TAB_IDS.includes(nextTab as DeploymentManagementTabId)) {
      activeTab.value = nextTab as DeploymentManagementTabId
    }
  }

  const handleDeploymentFilterApply = (value: Partial<DeploymentManagementSearchQuery>) => {
    const validation = validateFields([
      { field: 'term', label: 'Search term', value: value.term ?? '', maxLength: 120, pattern: REGEX_PATTERNS.alphaNumericSpace, patternMessage: 'Search term allows letters, numbers, spaces, periods, underscores, and hyphens only.' },
      { field: 'fields', label: 'Search field', value: value.fields ?? '', maxLength: 64 },
    ])
    const normalizedField = validation.values.fields
    const isFieldValid = !normalizedField || DEPLOYMENT_SEARCHABLE_FIELDS.includes(normalizedField as (typeof DEPLOYMENT_SEARCHABLE_FIELDS)[number])
    const errors = { ...validation.errors, ...(!isFieldValid ? { fields: 'Selected deployment field is invalid.' } : {}) }
    const filters: Partial<DeploymentManagementSearchQuery> = { term: validation.values.term || undefined, fields: normalizedField || undefined }
    deploymentFilters.value = filters
    return { filters, errors, isValid: Object.keys(errors).length === 0 }
  }

  const handleDeploymentFilterReset = () => {
    const filters: Partial<DeploymentManagementSearchQuery> = {}
    deploymentFilters.value = filters
    return filters
  }

  return { handleTabChange, handleDeploymentFilterApply, handleDeploymentFilterReset }
}
