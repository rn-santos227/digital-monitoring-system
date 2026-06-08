interface EquipmentActionRow {
  id?: unknown
}

type EquipmentTableAction = (id: string) => Promise<unknown> | unknown
type EquipmentTableActionMap = Readonly<Record<string, EquipmentTableAction>>