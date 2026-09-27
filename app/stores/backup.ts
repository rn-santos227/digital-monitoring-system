import { defineStore } from 'pinia'
import type { BackupState } from '~/types/domain/backup'
import { extractApiErrorMessage } from '~/utils/api-request'
import { downloadSystemBackupEndpoint } from '~/utils/download-system-backup-endpoint'

const INITIAL_BACKUP_STATE: BackupState = {
  isDownloading: false,
  downloadError: '',
}

const backupStoreOptions = {
  state: (): BackupState => ({ ...INITIAL_BACKUP_STATE }),
}
