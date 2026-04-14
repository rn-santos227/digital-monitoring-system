import type { H3Event } from 'h3'
import type { LogActionInput } from '../../shared/models'
import { getServiceSupabaseClient } from '../auth/serviceClient'

export async function logAction(_event: H3Event, input: LogActionInput) {
  const supabase = getServiceSupabaseClient()

  const { data, error } = await supabase
    .from('audit_logs')
    .insert({
      user_id: input.userId ?? null,
      action: input.action,
      table_name: input.tableName,
      record_id: input.recordId ?? null,
      old_data: input.oldData ?? null,
      new_data: input.newData ?? null,
      request_data: input.requestData ?? null,
      response_data: input.responseData ?? null,
      request_headers: input.requestHeaders ?? null,
      ip_address: input.ipAddress ?? null,
      status_code: input.statusCode ?? null,
      metadata: input.metadata ?? null,
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to write audit log: ${error.message}`)
  }

  return data
}
