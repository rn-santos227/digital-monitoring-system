import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'

interface BulkDeleteUsersHandlerOptions {
  selectedIds: Ref<string[]>
  deleteUserProfile: (id: string) => Promise<void>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeleteUsersHandler = ({
  selectedIds,
  deleteUserProfile,
  reload,
  showDialog,
}: BulkDeleteUsersHandlerOptions) => {
  const deleteSelectedUsers = async () => {

  }

  return { deleteSelectedUsers }
}
