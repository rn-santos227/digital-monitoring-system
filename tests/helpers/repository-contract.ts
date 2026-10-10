import { describe, expect, it } from 'vitest'

import { createSupabaseMock } from './supabase'

type RepositoryOperation = (...args: unknown[]) => Promise<unknown>

const modules = import.meta.glob<Record<string, RepositoryOperation>>(
  '/server/utils/**/*.ts',
)

interface RepositoryContract {
  domain: string
  table: string
  entity: string
  payload: Record<string, unknown>
  returnsCreatedRow?: boolean
  missingReadStatus?: number
}

export const defineRepositoryContractTests = ({
  domain,
  table,
  entity,
  payload,
  returnsCreatedRow = false,
  missingReadStatus,
}: RepositoryContract) => {
  const load = async (operation: string) => {
    const loader = modules[`/server/utils/${domain}/${operation}.ts`]
    if (!loader)
      throw new Error(`Missing repository module: ${domain}/${operation}`)
    const module = await loader()
    const handler = module[operation]
    if (!handler) throw new Error(`Missing repository export: ${operation}`)
    return handler
  }

  describe(`${domain} persistence behavior`, () => {
    it('inserts the supplied fields into the correct domain table and returns its created identity', async () => {
      const create = await load(`create${entity}`)
      const row = { id: 'record-id', ...payload }
      const database = createSupabaseMock([{ data: row, error: null }])
      const result = await create(database.client, payload)
      expect(result).toEqual(returnsCreatedRow ? row : row.id)
      expect(database.from).toHaveBeenCalledExactlyOnceWith(table)
      expect(database.calls).toContainEqual({
        table,
        method: 'insert',
        args: [payload],
      })
      expect(database.calls.some((call) => call.method === 'select')).toBe(true)
    })

    it.each([
      { data: null, error: { message: 'insert failed' } },
      { data: null, error: null },
    ])('rejects failed or missing create results %j', async (result) => {
      const create = await load(`create${entity}`)
      const database = createSupabaseMock([result])
      await expect(create(database.client, payload)).rejects.toThrow()
    })

    it('reads a single record by id from the correct table', async () => {
      const read = await load(`get${entity}ById`)
      const row = { id: 'record-id', ...payload }
      const database = createSupabaseMock([{ data: row, error: null }])
      await expect(read(database.client, 'record-id')).resolves.toEqual(row)
      expect(database.from).toHaveBeenCalledExactlyOnceWith(table)
      expect(database.calls).toContainEqual({
        table,
        method: 'eq',
        args: ['id', 'record-id'],
      })
    })

    it('handles a missing record without returning unrelated data', async () => {
      const read = await load(`get${entity}ById`)
      const database = createSupabaseMock([{ data: null, error: null }])
      const result = read(database.client, 'missing')
      if (missingReadStatus) {
        await expect(result).rejects.toMatchObject({
          statusCode: missingReadStatus,
        })
      } else {
        await expect(result).resolves.toBeNull()
      }
    })

    it('deletes only the requested identity', async () => {
      const remove = await load(`delete${entity}ById`)
      const database = createSupabaseMock([{ data: null, error: null }])
      await remove(database.client, 'record-id')
      expect(database.from).toHaveBeenCalledExactlyOnceWith(table)
      expect(database.calls).toContainEqual({
        table,
        method: 'delete',
        args: [],
      })
      expect(database.calls).toContainEqual({
        table,
        method: 'eq',
        args: ['id', 'record-id'],
      })
    })

    it.each(['get', 'delete'] as const)(
      'propagates database failure from %s',
      async (operation) => {
        const handler = await load(`${operation}${entity}ById`)
        const database = createSupabaseMock([
          { data: null, error: { message: 'database failure' } },
        ])
        await expect(handler(database.client, 'record-id')).rejects.toThrow(
          'database failure',
        )
      },
    )
  })
}

export const defineRepositoryUpdateTests = (
  domain: string,
  table: string,
  entity: string,
  updates: Record<string, unknown>,
) => {
  describe(`${domain} updates`, () => {
    const load = async () => {
      const operation = `update${entity}ById`
      const loader = modules[`/server/utils/${domain}/${operation}.ts`]
      if (!loader) throw new Error(`Missing update module: ${domain}`)
      const handler = (await loader())[operation]
      if (!handler) throw new Error(`Missing update export: ${operation}`)
      return handler
    }

    it('updates only the supplied fields on the requested record', async () => {
      const update = await load()
      const database = createSupabaseMock([{ data: null, error: null }])
      await update(database.client, 'record-id', updates)
      expect(database.from).toHaveBeenCalledExactlyOnceWith(table)
      expect(database.calls).toContainEqual({
        table,
        method: 'update',
        args: [updates],
      })
      expect(database.calls).toContainEqual({
        table,
        method: 'eq',
        args: ['id', 'record-id'],
      })
    })

    it('propagates database errors without retrying the mutation', async () => {
      const update = await load()
      const database = createSupabaseMock([
        { data: null, error: { message: 'update failed' } },
      ])
      await expect(
        update(database.client, 'record-id', updates),
      ).rejects.toThrow('update failed')
      expect(database.from).toHaveBeenCalledOnce()
    })
  })
}
