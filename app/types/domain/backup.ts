export interface DownloadedBackup {
  blob: Blob
  fileName: string
}

export interface BackupState {
  isDownloading: boolean
  downloadError: string
}
