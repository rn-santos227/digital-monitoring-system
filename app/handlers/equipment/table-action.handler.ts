interface EquipmentActionRow {
  id?: unknown
}

type EquipmentTableAction = (id: string) => Promise<unknown> | unknown
type EquipmentTableActionMap = Readonly<Record<string, EquipmentTableAction>>

interface EquipmentTableActionPayload<TRow extends EquipmentActionRow> {
  actionKey: string
  row: TRow
}

export const createEquipmentTableActionHandler = <TRow extends EquipmentActionRow>(
  actions: EquipmentTableActionMap,
) => {
  return async ({ actionKey, row }: EquipmentTableActionPayload<TRow>) => {
    const equipmentRecordId = String(row.id ?? '')
    const action = actions[actionKey]
  }
}
