import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DEPLOYMENT_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { DeploymentSuggestionRow } from '../../shared/models'

export async function getDeploymentSuggestionById(supabase: SupabaseClient, id: string): Promise<DeploymentSuggestionRow | null> {
  const { data, error } = await supabase
    .from('deployments')
    .select(DEPLOYMENT_SUGGESTION_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read deployment suggestion: ${error.message}` })
  }

  return (data as DeploymentSuggestionRow | null)
}
