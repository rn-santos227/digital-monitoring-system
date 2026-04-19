import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  PERSONNEL_PROFILE_SUMMARY_SELECT_COLUMNS,
} from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { getPersonnelReferenceCount } from '../../../shared/utils'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'


export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.personnelDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')
  const supabase = getServiceSupabaseClient()

  const { data: existingPersonnel, error: existingPersonnelError } = await supabase
    .from('personnel')
    .select(PERSONNEL_PROFILE_SUMMARY_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingPersonnelError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read personnel record: ${existingPersonnelError.message}` })
  }

  if (!existingPersonnel) {
    throw createError({ statusCode: 404, statusMessage: 'Personnel record not found.' })
  }

  try {
    const [
      trainingRecordCount,
      deploymentRecordCount,
      deploymentSupervisorCount,
      engagementRecordCount,
      assignedAssetCount,
      issuanceRecipientCount,
      issuanceIssuerCount,
      qualificationCount,
      medicalReadinessCount,
      weaponAssignmentCount,
    ] = await Promise.all([
      getPersonnelReferenceCount({
        supabase, table: 'training_records', column: 'personnel_id', id }),
      getPersonnelReferenceCount({
        supabase, table: 'deployment_records', column: 'personnel_id', id }),
      getPersonnelReferenceCount({
        supabase, table: 'deployment_records', column: 'supervisor_id', id }),
      getPersonnelReferenceCount({
        supabase, table: 'engagement_records', column: 'personnel_id', id }),
      getPersonnelReferenceCount({
        supabase, table: 'equipment_assets', column: 'assigned_personnel_id', id }),
      getPersonnelReferenceCount({
        supabase, table: 'equipment_issuances', column: 'issued_to_personnel_id', id }),
      getPersonnelReferenceCount({
        supabase, table: 'equipment_issuances', column: 'issued_by_personnel_id', id }),
      getPersonnelReferenceCount({
        supabase, table: 'personnel_qualifications', column: 'personnel_id', id }),
      getPersonnelReferenceCount({
        supabase, table: 'personnel_medical_readiness', column: 'personnel_id', id }),
      getPersonnelReferenceCount({
        supabase, table: 'personnel_weapon_assignments', column: 'personnel_id', id }),
    ])

    const hasReferences = [
      trainingRecordCount,
      deploymentRecordCount,
      deploymentSupervisorCount,
      engagementRecordCount,
      assignedAssetCount,
      issuanceRecipientCount,
      issuanceIssuerCount,
      qualificationCount,
      medicalReadinessCount,
      weaponAssignmentCount,
    ].some(count => count > 0)

    if (hasReferences) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Personnel record is in use and cannot be deleted.',
      })
    }

    const { error: deleteError } = await supabase
      .from('personnel')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to delete personnel record: ${deleteError.message}` })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.personnelDelete,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelDelete,
      recordId: id,
      oldData: existingPersonnel,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Personnel record deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.personnelDelete,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelDelete,
      recordId: id,
      oldData: existingPersonnel,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
