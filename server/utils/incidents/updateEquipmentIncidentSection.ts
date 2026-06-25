import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { createError } from 'h3'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_OUTCOMES,
} from '../../shared/constants'
import type {
  EquipmentIncidentCreate,
  EquipmentIncidentUpdate,
} from '../../shared/models'
import { mapEquipmentIncidentListItem } from '../../shared/utils'
import { recordManagementAuditLog } from '../audit/recordManagementAuditLog'
import { executeWithRollback } from '../db/executeWithRollback'
import { assertIncidentReferencesExist } from './assertIncidentReferencesExist'
import { getEquipmentIncidentById } from './getEquipmentIncidentById'
import { updateEquipmentIncidentById } from './updateEquipmentIncidentById'


