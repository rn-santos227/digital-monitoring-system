import { defineStore } from 'pinia'
import type { BackupState } from '~/types/domain/backup'
import { extractApiErrorMessage } from '~/utils/api-request'
import { downloadSystemBackupEndpoint } from '~/utils/download-system-backup-endpoint'