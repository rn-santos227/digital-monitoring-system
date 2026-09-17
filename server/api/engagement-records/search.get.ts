import { createError, defineEventHandler, getQuery } from 'h3'
import type { EngagementRecordListResponse } from '../../shared/responses'
import {
  ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS,
  PERMISSION_CODES,
} from '../../shared/constants'
import {
  mapEngagementRecordListItem,
  parseManagementPaginationQuery,
} from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
const REQUIRED_PERMISSION_CODE = PERMISSION_CODES.engagementManage

