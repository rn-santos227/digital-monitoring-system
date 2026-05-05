import type { SupabaseClient } from '@supabase/supabase-js'
import type { DeploymentRow } from '../../shared/models'
import { getNextDeploymentRecordNo } from './getNextDeploymentRecordNo'
import { createDeploymentRecord } from './createDeploymentRecord'

interface EnsureDeploymentPersonnelAssignmentParams {
  supabase: SupabaseClient
  deployment: DeploymentRow & { id: string }
  personnelId: string
  remarks?: string | null
}

export async function ensureDeploymentPersonnelAssignment({
  supabase,
  deployment,
  personnelId,
  remarks,
}: EnsureDeploymentPersonnelAssignmentParams): Promise<{ createdRecordNo: string | null }> {
  const { data: existingRecord, error } = await supabase
    .from('deployment_records')
    .select('id')
    .eq('deployment_id', deployment.id)
    .eq('personnel_id', personnelId)
    .maybeSingle<{ id: string }>()

  if (error) {
    throw new Error(`Failed to verify deployment personnel assignment: ${error.message}`)
  }

  if (existingRecord?.id) {
    return { createdRecordNo: null }
  }

  const recordNo = await getNextDeploymentRecordNo(supabase)

  await createDeploymentRecord(supabase, {
    personnel_id: personnelId,
    deployment_id: deployment.id,
    deployment_area: deployment.deployment_area,
    deployment_area_latitude: deployment.deployment_area_latitude,
    deployment_area_longitude: deployment.deployment_area_longitude,
    assignment_role: deployment.assignment_role,
    operation_name: deployment.operation_name,
    start_date: deployment.start_date,
    end_date: deployment.end_date,
    status_id: deployment.status_id,
    location: deployment.location,
    supervisor_id: deployment.supervisor_id,
    remarks: remarks ?? deployment.default_remarks ?? null,
    record_no: recordNo,
  })

  return { createdRecordNo: recordNo }
}
