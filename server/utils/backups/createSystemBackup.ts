import type { SupabaseClient } from '@supabase/supabase-js'
import { BACKUP_FORMAT_VERSION, BACKUP_TABLES, type BackupTableName } from '../../shared/constants'
import type { BackupRecord, SystemBackup } from '../../shared/models'
import { fetchAllTableRecords } from './fetchAllTableRecords'

export const createSystemBackup = async (
  supabase: SupabaseClient,
  generatedAt: string,
  generatedBy: string,
): Promise<SystemBackup> => {

}