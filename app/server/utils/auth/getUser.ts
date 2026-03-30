import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

interface LogActionInput {
  userId?: string | null
  action: string
  tableName: string
  recordId?: string | null
  oldData?: Record<string, unknown> | null
  newData?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
}

export async function logAction(event: H3Event, input: LogActionInput) {
  const supabase = (await serverSupabaseClient(event)) as any

  const { data, error } = await supabase
    .from('audit_logs')
    .insert({
      user_id: input.userId ?? null,
      action: input.action,
      table_name: input.tableName,
      record_id: input.recordId ?? null,
      old_data: input.oldData ?? null,
      new_data: input.newData ?? null,
      metadata: input.metadata ?? null,
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to write audit log: ${error.message}`)
  }

  return data
}
