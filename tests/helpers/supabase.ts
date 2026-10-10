import type { SupabaseClient } from '@supabase/supabase-js'
import { vi } from 'vitest'

export interface DatabaseResult {
  data: unknown
  error: { message: string } | null
  count?: number | null
}

export interface DatabaseCall {
  table: string
  method: string
  args: unknown[]
}

/** A recording, queued query adapter. It never opens a database connection. */
export const createSupabaseMock = (results: DatabaseResult[] = []) => {
  const calls: DatabaseCall[] = []
  const queue = [...results]
  const fallback: DatabaseResult = { data: null, error: null, count: 0 }
  const methods = [
    'select',
    'insert',
    'upsert',
    'update',
    'delete',
    'eq',
    'neq',
    'is',
    'in',
    'gt',
    'gte',
    'lt',
    'lte',
    'or',
    'ilike',
    'like',
    'not',
    'filter',
    'order',
    'range',
    'limit',
    'returns',
    'single',
    'maybeSingle',
    'match',
    'contains',
  ]

  const from = vi.fn((table: string) => {
    calls.push({ table, method: 'from', args: [] })
    const chain: Record<string, unknown> = {}
    for (const method of methods) {
      chain[method] = (...args: unknown[]) => {
        calls.push({ table, method, args })
        return chain
      }
    }
    chain.then = (resolve: (value: DatabaseResult) => unknown) =>
      Promise.resolve(queue.shift() ?? fallback).then(resolve)
    return chain
  })

  const auth = {
    admin: {
      getUserById: vi.fn(),
      createUser: vi.fn(),
      updateUserById: vi.fn(),
      deleteUser: vi.fn(),
    },
    signInWithPassword: vi.fn(),
  }
  const client = { from, auth } as unknown as SupabaseClient

  return { client, calls, from, auth, queue }
}
