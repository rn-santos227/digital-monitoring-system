interface EquipmentActionRow {
  id?: unknown
}

type EquipmentTableAction = (id: string) => Promise<unknown> | unknown
type EquipmentTableActionMap = Readonly<Record<string, EquipmentTableAction>>

interface EquipmentTableActionPayload<TRow extends EquipmentActionRow> {
  actionKey: string
  row: TRow
}