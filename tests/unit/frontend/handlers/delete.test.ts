import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

type Action = (...args: unknown[]) => Promise<unknown>
type Factory = (options: Record<string, unknown>) => Record<string, Action>
const modules = import.meta.glob<Record<string, Factory>>(
  '/app/handlers/**/delete.handler.ts',
)

interface DeleteContract {
  feature: string
  entity: string
  action?: string
  row?: boolean
  propagatesError?: boolean
}

const contracts: DeleteContract[] = [
  {
    feature: 'battalions',
    entity: 'Battalion',
    row: true,
    action: 'onDeleteBattalionAction',
  },
  {
    feature: 'companies',
    entity: 'Company',
    row: true,
    action: 'onDeleteCompanyAction',
  },
  {
    feature: 'users',
    entity: 'UserProfile',
    row: true,
    action: 'onDeleteAction',
  },
  {
    feature: 'account-types',
    entity: 'AccountType',
    row: true,
    action: 'onDeleteAccountTypeAction',
  },
  { feature: 'ranks', entity: 'Rank' },
  { feature: 'personnel', entity: 'Personnel' },
  { feature: 'trainings', entity: 'Training' },
  { feature: 'trainings', entity: 'TrainingCategory' },
  { feature: 'trainings', entity: 'TrainingRecord' },
  { feature: 'equipment', entity: 'EquipmentCategory' },
  { feature: 'equipment', entity: 'EquipmentItem' },
  { feature: 'equipment', entity: 'EquipmentAsset' },
  { feature: 'equipment', entity: 'EquipmentIssuance' },
  { feature: 'incidents', entity: 'EquipmentIncident' },
  { feature: 'deployments', entity: 'Deployment', row: true },
  {
    feature: 'deployments',
    entity: 'DeploymentRecord',
    row: true,
    propagatesError: true,
  },
  { feature: 'engagements', entity: 'Engagement' },
  { feature: 'engagements', entity: 'EngagementRecord' },
]

const createController = async (contract: DeleteContract) => {
  const load = modules[`/app/handlers/${contract.feature}/delete.handler.ts`]
  if (!load) throw new Error(`Missing module for ${contract.feature}`)
  const exports = await load()
  const factory = exports[`useDelete${contract.entity}Handler`]
  if (!factory) throw new Error(`Missing delete factory for ${contract.entity}`)
  const deleteRecord = vi.fn().mockResolvedValue(undefined)
  const showDialog = vi.fn().mockResolvedValue({ confirmed: true })
  const onDeleteSuccess = vi.fn()
  const onDeleteCancelled = vi.fn()
  const profileWarning = ref('')
  const controller = factory({
    [`delete${contract.entity}`]: deleteRecord,
    showDialog,
    onDeleteSuccess,
    onDeleteCancelled,
    profileWarning,
    addToast: vi.fn(),
  })
  const action = controller[contract.action ?? `onDelete${contract.entity}`]
  if (!action) throw new Error(`Missing delete action for ${contract.entity}`)
  return {
    action,
    deleteRecord,
    showDialog,
    onDeleteSuccess,
    onDeleteCancelled,
    profileWarning,
  }
}

describe.each(contracts)('$entity deletion confirmation', (contract) => {
  const input = contract.row ? { id: 'record' } : 'record'

  it('waits for explicit confirmation before deleting exactly once', async () => {
    const { action, deleteRecord, showDialog, onDeleteCancelled } =
      await createController(contract)
    let confirm: ((result: { confirmed: boolean }) => void) | undefined
    showDialog.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          confirm = resolve
        }),
    )
    const pending = action(input)
    expect(deleteRecord).not.toHaveBeenCalled()
    confirm?.({ confirmed: true })
    await pending
    expect(deleteRecord).toHaveBeenCalledExactlyOnceWith('record')
    expect(onDeleteCancelled).not.toHaveBeenCalled()
  })

  it('preserves the record when the operator cancels', async () => {
    const { action, deleteRecord, showDialog, onDeleteSuccess } =
      await createController(contract)
    showDialog.mockResolvedValue({ confirmed: false })
    await action(input)
    expect(deleteRecord).not.toHaveBeenCalled()
    expect(onDeleteSuccess).not.toHaveBeenCalled()
  })

  it('reports deletion errors without firing success callbacks', async () => {
    const { action, deleteRecord, showDialog, onDeleteSuccess } =
      await createController(contract)
    const error = new Error('Deletion denied')
    deleteRecord.mockRejectedValue(error)
    if (contract.propagatesError) {
      await expect(action(input)).rejects.toBe(error)
    } else {
      await action(input)
      expect(showDialog).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error', message: 'Deletion denied' }),
      )
    }
    expect(onDeleteSuccess).not.toHaveBeenCalled()
  })

  if (contract.row) {
    it('ignores rows without an identifier', async () => {
      const { action, deleteRecord, showDialog } =
        await createController(contract)
      await action({})
      expect(deleteRecord).not.toHaveBeenCalled()
      expect(showDialog).not.toHaveBeenCalled()
    })
  }
})
