export const BACKUP_FORMAT_VERSION = 1
export const BACKUP_PAGE_SIZE = 1_000
export const BACKUP_FILE_PREFIX = 'digital-afp-monitoring-backup'

export const BACKUP_TABLES = Object.freeze([
  'ranks',
  'battalions',
  'companies',

])

export type BackupTableName = (typeof BACKUP_TABLES)[number]
