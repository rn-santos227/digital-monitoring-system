import type { BackupTableName } from '../../constants'

export type BackupRecord = Record<string, unknown>

export interface SystemBackup {
  formatVersion: number
  generatedAt: string
}
