import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuditLogListItem, AuditLogListQuery } from '~/types/domain/audit'
import { getAuditLogsEndpoint } from '~/utils/audit-endpoints'

