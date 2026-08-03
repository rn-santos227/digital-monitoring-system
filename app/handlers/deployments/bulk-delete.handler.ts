import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'
import { deleteBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkDeleteDeploymentsHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

interface BulkDeleteDeploymentRecordsHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeleteDeploymentsHandler = ({
  selectedIds,
  reload,
  showDialog,
}: BulkDeleteDeploymentsHandlerOptions) => {
  const deleteSelectedDeployments = async () => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      return
    }

    const result = await showDialog({
      type: 'question',
      title: 'Proceed with bulk delete?',
      message: `Are you sure you want to delete ${ids.length} selected ${ids.length === 1 ? 'deployment' : 'deployments'}? This action cannot be undone. For safety, no records will be deleted if any selection is missing or is referenced by another record.`,
      confirmLabel: 'Yes, delete selected',
      cancelLabel: 'No, keep records',
    })
    if (!result.confirmed) {
      return
    }

    try {
      const response = await deleteBulkRecordsEndpoint('deployments', ids)
      selectedIds.value = []
      await reload()
      await showDialog({
        type: 'success',
        title: 'Deployments deleted',
        message: `${response.affectedCount} ${response.affectedCount === 1 ? 'deployment' : 'deployments'} ${response.affectedCount === 1 ? 'was' : 'were'} deleted successfully.`,
        confirmLabel: 'OK',
      })
    } catch (error: unknown) {
      await showDialog({
        type: 'error',
        title: 'Bulk delete blocked',
        message: extractApiErrorMessage(
          error,
          'No deployments were deleted. Check whether the selected records are still in use and try again.',
        ),
        confirmLabel: 'OK',
      })
    }
  }

  return { deleteSelectedDeployments }
}

export const useBulkDeleteDeploymentRecordsHandler = ({
  selectedIds,
  reload,
  showDialog,
}: BulkDeleteDeploymentRecordsHandlerOptions) => {
  const deleteSelectedDeploymentRecords = async () => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      return
    }

    const result = await showDialog({
      type: 'question',
      title: 'Proceed with bulk delete?',
      message: `Are you sure you want to delete ${ids.length} selected ${ids.length === 1 ? 'deployment record' : 'deployment records'}? This action cannot be undone. For safety, no records will be deleted if any selection is missing or is referenced by another record.`,
      confirmLabel: 'Yes, delete selected',
      cancelLabel: 'No, keep records',
    })
    if (!result.confirmed) {
      return
    }

    try {
      const response = await deleteBulkRecordsEndpoint('deployment-records', ids)
      selectedIds.value = []
      await reload()

    } catch (error: unknown) {
      await showDialog({
        type: 'error',
        title: 'Bulk delete blocked',
        message: extractApiErrorMessage(
          error,
          'No deployment records were deleted. Check whether the selected records are still in use and try again.',
        ),
        confirmLabel: 'OK',
      })
    }
  }

  return { deleteSelectedDeploymentRecords }
}
