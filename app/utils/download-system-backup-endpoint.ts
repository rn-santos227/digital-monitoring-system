import { API_LOADING_MESSAGES, BACKUP_API_ENDPOINTS } from '~/constants/api.constants'
import type { DownloadedBackup } from '~/types/domain/backup'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const downloadSystemBackupEndpoint = async (): Promise<DownloadedBackup> => {
  return await withApiLoading(async () => {
    
  }, API_LOADING_MESSAGES.downloadBackup)
}
