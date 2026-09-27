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

}
