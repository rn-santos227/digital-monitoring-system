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

}
