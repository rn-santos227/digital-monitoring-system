import { ref, type Ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

type Action = (...args: unknown[]) => Promise<unknown>
type Controller = Record<string, Action | Readonly<Ref<unknown>>>
type Factory = (options: Record<string, unknown>) => Controller
const modules = import.meta.glob<Record<string, Factory>>(
  '/app/handlers/**/update.handler.ts',
)

interface Contract {
  feature: string
  entity: string
  close: string
  open?: string
  rowInput?: boolean
  separateId?: boolean
  submit?: string
  catchesError?: boolean
  keepsSelection?: boolean
}
const contracts: Contract[] = [
  {
    feature: 'battalions',
    entity: 'Battalion',
    close: 'onCloseUpdateBattalionModal',
    open: 'onEditBattalionAction',
    rowInput: true,
    separateId: true,
  },
  {
    feature: 'companies',
    entity: 'Company',
    close: 'onCloseUpdateCompanyModal',
    open: 'onEditCompanyAction',
    rowInput: true,
    separateId: true,
  },
  {
    feature: 'account-types',
    entity: 'AccountType',
    close: 'onCloseUpdateAccountTypeModal',
    open: 'onEditAccountTypeAction',
    rowInput: true,
    separateId: true,
  },
  {
    feature: 'users',
    entity: 'UserProfile',
    close: 'onCloseUpdateUserProfileModal',
    open: 'onEditProfileAction',
    rowInput: true,
    separateId: true,
  },
  {
    feature: 'trainings',
    entity: 'Training',
    close: 'closeUpdateTrainingModal',
    open: 'onOpenUpdateTrainingModal',
  },
  {
    feature: 'trainings',
    entity: 'TrainingCategory',
    close: 'closeUpdateTrainingCategoryModal',
    open: 'onOpenUpdateTrainingCategoryModal',
  },
  {
    feature: 'trainings',
    entity: 'TrainingRecord',
    close: 'closeUpdateTrainingRecordModal',
  },
  {
    feature: 'equipment',
    entity: 'EquipmentCategory',
    close: 'closeUpdateEquipmentCategoryModal',
    open: 'onOpenUpdateEquipmentCategoryModal',
  },
  {
    feature: 'equipment',
    entity: 'EquipmentItem',
    close: 'closeUpdateEquipmentItemModal',
    open: 'onOpenUpdateEquipmentItemModal',
  },
  {
    feature: 'equipment',
    entity: 'EquipmentAsset',
    close: 'closeUpdateEquipmentAssetModal',
    open: 'onOpenUpdateEquipmentAssetModal',
  },
  {
    feature: 'equipment',
    entity: 'EquipmentIssuance',
    close: 'closeUpdateEquipmentIssuanceModal',
    open: 'onOpenUpdateEquipmentIssuanceModal',
  },
  {
    feature: 'engagements',
    entity: 'Engagement',
    close: 'onCloseUpdateEngagementModal',
    open: 'onOpenUpdateEngagementModal',
    submit: 'onSubmitUpdateEngagement',
    catchesError: true,
    keepsSelection: true,
  },
]

const setup = async (contract: Contract) => {
  const load = modules[`/app/handlers/${contract.feature}/update.handler.ts`]
  if (!load) throw new Error(`Missing update module for ${contract.feature}`)
  const exports = await load()
  const factory = exports[`useUpdate${contract.entity}Handler`]
  if (!factory) throw new Error(`Missing update factory for ${contract.entity}`)
  const selected = ref<Record<string, unknown> | null>(null)
  const selectedId = ref('')
  const isOpen = ref(false)
  const row = {
    id: 'record',
    code: 'UNIT',
    name: 'Unit',
    isActive: false,
    personnelId: null,
    email: 'unit@example.test',
    fullName: 'Unit User',
    avatarUrl: null,
    accountTypeIds: [],
    description: null,
    isSystem: false,
    permissionIds: [],
  }
  const fetch = vi.fn().mockResolvedValue(row)
  const update = vi.fn().mockResolvedValue(undefined)
  const showDialog = vi.fn().mockResolvedValue({ confirmed: true })
  const controller = factory({
    [`selected${contract.entity}`]: selected,
    [`selected${contract.entity}Id`]: selectedId,
    [`isUpdate${contract.entity}ModalOpen`]: isOpen,
    [`get${contract.entity}ById`]: fetch,
    [`update${contract.entity}`]: update,
    accountTypeOptions: ref([]),
    loadUserAccounts: vi.fn().mockResolvedValue(undefined),
    errorMessage: ref(''),
    showDialog,
  })
  const action = (key: string) => {
    const value = controller[key]
    if (typeof value !== 'function') throw new Error(`Missing action ${key}`)
    return value
  }
  return {
    selected,
    selectedId,
    isOpen,
    row,
    fetch,
    update,
    showDialog,
    controller,
    action,
    submit: action(contract.submit ?? `onUpdate${contract.entity}`),
    close: action(contract.close),
  }
}

describe.each(contracts)('$entity update lifecycle', (contract) => {
  const payload = { name: 'Updated', remarks: 'Reviewed' }

  it('does nothing when no record is selected', async () => {
    const { submit, update } = await setup(contract)
    await submit(payload)
    expect(update).not.toHaveBeenCalled()
  })

  it('keeps the modal open while saving and closes it after completion', async () => {
    const { submit, selected, selectedId, row, isOpen, update } =
      await setup(contract)
    selected.value = row
    selectedId.value = 'record'
    isOpen.value = true
    let complete: (() => void) | undefined
    update.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve
        }),
    )
    const pending = submit(payload)
    expect(isOpen.value).toBe(true)
    expect(update).toHaveBeenCalledExactlyOnceWith('record', payload)
    complete?.()
    await pending
    expect(isOpen.value).toBe(false)
    if (!contract.keepsSelection) expect(selected.value).toBeNull()
    if (contract.separateId) expect(selectedId.value).toBe('')
  })

  it('preserves the selected record and open form after a failed save', async () => {
    const { submit, selected, selectedId, row, isOpen, update, showDialog } =
      await setup(contract)
    selected.value = row
    selectedId.value = 'record'
    isOpen.value = true
    const error = new Error('Update rejected')
    update.mockRejectedValue(error)
    if (contract.catchesError) {
      await submit(payload)
      expect(showDialog).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error', message: 'Update rejected' }),
      )
    } else {
      await expect(submit(payload)).rejects.toBe(error)
    }
    expect(isOpen.value).toBe(true)
    expect(selected.value).toEqual(row)
  })

  if (contract.open) {
    it('loads the selected record before opening the form', async () => {
      const { action, fetch, selected, isOpen } = await setup(contract)
      await action(contract.open ?? '')(
        contract.rowInput ? { id: 'record' } : 'record',
      )
      expect(fetch).toHaveBeenCalledExactlyOnceWith('record')
      expect(selected.value).not.toBeNull()
      expect(isOpen.value).toBe(true)
    })

    it('keeps the modal closed when the detail lookup fails', async () => {
      const { action, fetch, selected, isOpen } = await setup(contract)
      const error = new Error('Record unavailable')
      fetch.mockRejectedValue(error)
      await expect(
        action(contract.open ?? '')(
          contract.rowInput ? { id: 'record' } : 'record',
        ),
      ).rejects.toBe(error)
      expect(selected.value).toBeNull()
      expect(isOpen.value).toBe(false)
    })
  }
})
