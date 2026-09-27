import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { BACKUP_PRIVILEGES } from '~/constants/privileges.constants'
import {
  BACKUP_DOWNLOAD_ERROR,
  BACKUP_DOWNLOAD_SUCCESS,
} from '~/constants/page.constants'
import { useDialog } from '~/composables/useDialog'
import { useAuthStore } from '~/stores/auth'
import { useBackupStore } from '~/stores/backup'
import { showErrorDialog } from '~/utils/error-handling'

export const useDownloadBackupHandler = () => {
  const authStore = useAuthStore()
  const backupStore = useBackupStore()
  const { downloadError: errorMessage, isDownloading } = storeToRefs(backupStore)
  const { showDialog } = useDialog()
  const canDownload = computed(() => authStore.hasPermissionAccess(BACKUP_PRIVILEGES.download))

  const onDownloadBackup = async () => {
    if (!canDownload.value || isDownloading.value) {
      return
    }

    try {
      const { blob, fileName } = await backupStore.download()
      const objectUrl = URL.createObjectURL(blob)
      const downloadLink = document.createElement('a')
      downloadLink.href = objectUrl
      downloadLink.download = fileName
      downloadLink.click()

    } catch (error: unknown) {
      errorMessage.value = await showErrorDialog({
        showDialog,
        title: 'Unable to download backup',
        error,
        fallbackMessage: BACKUP_DOWNLOAD_ERROR,
      })
    }
  }

  return { canDownload, errorMessage, isDownloading, onDownloadBackup }
}
