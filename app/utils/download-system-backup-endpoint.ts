import { API_LOADING_MESSAGES, BACKUP_API_ENDPOINTS } from '~/constants/api.constants'
import type { DownloadedBackup } from '~/types/domain/backup'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const downloadSystemBackupEndpoint = async (): Promise<DownloadedBackup> => {
  return await withApiLoading(async () => {
    const response = await fetch(BACKUP_API_ENDPOINTS.download, {
      method: 'GET',
      headers: createSessionHeaders(),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null) as { statusMessage?: string } | null
      throw new Error(errorBody?.statusMessage ?? 'Unable to download the system backup.')
    }

    const contentDisposition = response.headers.get('content-disposition')
    const fileNameMatch = contentDisposition?.match(/filename="([^"]+)"/i)

    return {
      blob: await response.blob(),
      fileName: fileNameMatch?.[1] ?? 'digital-afp-monitoring-backup.json',
    }
  }, API_LOADING_MESSAGES.downloadBackup)
}
