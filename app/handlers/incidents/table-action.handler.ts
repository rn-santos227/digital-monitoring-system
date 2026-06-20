export const createIncidentTableActionHandler = <TRow extends { id: string }>(handlers: Record<string, (id: string, row: TRow) => void | Promise<void>>) => {
  return async ({ actionKey, row }: { actionKey: string; row: TRow }) => {
    await handlers[actionKey]?.(row.id, row)
  }
}
