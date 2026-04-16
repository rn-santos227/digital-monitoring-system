import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

type Handler = (...args: unknown[]) => unknown
type HandlerFactory = (
  options: Record<string, unknown>,
) => Record<string, Handler>
const modules = import.meta.glob<Record<string, HandlerFactory>>(
  '/app/handlers/**/create.handler.ts',
)

interface CreateContract {
  feature: string
  entity: string
  catchesError?: boolean
  submitPrefix?: 'onCreate' | 'onSubmitCreate'
  modalKey?: string
}

const contracts: CreateContract[] = [
  { feature: 'battalions', entity: 'Battalion' },
  { feature: 'companies', entity: 'Company' },
  { feature: 'trainings', entity: 'Training' },
  { feature: 'trainings', entity: 'TrainingCategory' },
  { feature: 'trainings', entity: 'TrainingRecord' },
  { feature: 'equipment', entity: 'EquipmentCategory' },
  { feature: 'equipment', entity: 'EquipmentItem' },
  { feature: 'equipment', entity: 'EquipmentAsset' },
  {
    feature: 'equipment',
    entity: 'EquipmentIssuance',
    catchesError: true,
    submitPrefix: 'onSubmitCreate',
  },
  {
    feature: 'incidents',
    entity: 'EquipmentIncident',
    catchesError: true,
    submitPrefix: 'onSubmitCreate',
  },
  {
    feature: 'deployments',
    entity: 'Deployment',
    catchesError: true,
    submitPrefix: 'onSubmitCreate',
  },
  {
    feature: 'deployments',
    entity: 'DeploymentRecord',
    catchesError: true,
    submitPrefix: 'onSubmitCreate',
  },
  {
    feature: 'engagements',
    entity: 'Engagement',
    catchesError: true,
    submitPrefix: 'onSubmitCreate',
  },
  {
    feature: 'engagements',
    entity: 'EngagementRecord',
    catchesError: true,
    submitPrefix: 'onSubmitCreate',
  },
  { feature: 'users', entity: 'UserProfile' },
  {
    feature: 'account-types',
    entity: 'AccountType',
    modalKey: 'isAccountTypeModalOpen',
  },
]

const createController = async (contract: CreateContract) => {
  const load = modules[`/app/handlers/${contract.feature}/create.handler.ts`]
  if (!load) throw new Error(`Missing handler module for ${contract.feature}`)
  const exports = await load()
  const factory = exports[`useCreate${contract.entity}Handler`]
  if (!factory) throw new Error(`Missing create handler for ${contract.entity}`)
  const isOpen = ref(true)
  const errorMessage = ref('')
  const create = vi.fn().mockResolvedValue({ id: 'created', ok: true })
  const showDialog = vi.fn().mockResolvedValue({ confirmed: true })
  const success = vi.fn()
  const failure = vi.fn()
  const loadAccounts = vi.fn().mockResolvedValue(undefined)
  const controller = factory({
    [contract.modalKey ?? `isCreate${contract.entity}ModalOpen`]: isOpen,
    [`create${contract.entity}`]: create,
    errorMessage,
    showDialog,
    onCreateSuccess: success,
    onCreateError: failure,
    accountTypeOptions: ref([]),
    profileWarning: ref('Old warning'),
    loadUserAccounts: loadAccounts,
  })
  const submit =
    controller[`${contract.submitPrefix ?? 'onCreate'}${contract.entity}`]
  if (!submit) throw new Error(`Missing submit action for ${contract.entity}`)
  return {
    controller,
    submit,
    isOpen,
    errorMessage,
    create,
    showDialog,
    success,
    failure,
    loadAccounts,
  }
}

describe.each(contracts)('$entity creation lifecycle', (contract) => {
  const payload = { name: 'Unit test', code: 'TEST', remarks: 'Test payload' }

  it('opens and closes the modal through its available controls', async () => {
    const { controller, isOpen } = await createController(contract)
    const open = controller[`onOpenCreate${contract.entity}Modal`]
    const close = controller[`onCloseCreate${contract.entity}Modal`]
    if (open) {
      isOpen.value = false
      await open()
      expect(isOpen.value).toBe(true)
    }
    if (close) {
      await close()
      expect(isOpen.value).toBe(false)
    }
  })

  it('creates exactly once and closes only after success', async () => {
    const { submit, create, isOpen } = await createController(contract)
    await submit(payload)
    expect(create).toHaveBeenCalledExactlyOnceWith(payload)
    expect(isOpen.value).toBe(false)
  })

  it('keeps the form open and exposes submission failure', async () => {
    const { submit, create, isOpen, errorMessage, showDialog } =
      await createController(contract)
    const error = new Error('Creation rejected')
    create.mockRejectedValue(error)
    if (contract.catchesError) {
      await submit(payload)
      expect(errorMessage.value).toBe('Creation rejected')
      expect(showDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          message: 'Creation rejected',
        }),
      )
    } else {
      await expect(submit(payload)).rejects.toBe(error)
    }
    expect(isOpen.value).toBe(true)
    expect(create).toHaveBeenCalledTimes(1)
  })
})
