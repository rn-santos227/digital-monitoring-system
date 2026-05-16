import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { PersonnelDeploymentLocationRow } from '../../shared/models'

export async function fetchPersonnelDeploymentLocations(supabase: SupabaseClient, selectColumns: string) {
  const { data, error } = await supabase
    .from('deployment_records')
    .select(selectColumns)
    .in('deployment_statuses.name', ['Planned', 'Active'])
    .returns<PersonnelDeploymentLocationRow[]>()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel deployment locations: ${error.message}` })
  }

  return data ?? []
}
