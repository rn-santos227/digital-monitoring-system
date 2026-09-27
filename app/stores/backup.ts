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

  getters: {
    hasDownloadError: (state: BackupState) => Boolean(state.downloadError),
  },

  actions: {
    async download(this: BackupState) {
      this.isDownloading = true
      this.downloadError = ''

      try {
        return await downloadSystemBackupEndpoint()
      } catch (error: unknown) {
        this.downloadError = extractApiErrorMessage(error, 'Unable to download the system backup right now.')
        throw error
      } finally {
        this.isDownloading = false
      }
    }
  },
}

export const useBackupStore = defineStore('backup', backupStoreOptions)
