import type { BackupTableName } from '../../constants'

export type BackupRecord = Record<string, unknown>

export interface SystemBackup {
  formatVersion: number
  generatedAt: string
  generatedBy: string
  application: 'Digital AFP Personnel and Equipment Monitoring System'
  tables: Record<BackupTableName, BackupRecord[]>
}
