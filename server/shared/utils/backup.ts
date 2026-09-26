import {
  BACKUP_FILE_PREFIX,
  BACKUP_FORMAT_VERSION,
  type BackupTableName,
} from '../constants'
import type { BackupRecord, SystemBackup } from '../models'

export const buildSystemBackup = (
  generatedAt: string,
  generatedBy: string,
  tables: Record<BackupTableName, BackupRecord[]>,
): SystemBackup => ({

})
