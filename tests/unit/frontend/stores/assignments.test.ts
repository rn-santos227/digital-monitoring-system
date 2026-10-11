import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAssignmentsStore } from '@/app/stores/assignments'
import { useAssignments } from '@/app/composables/useAssignments'

const assignments = [
  {
    name: 'deployment',
    run: (store: ReturnType<typeof useAssignments>) =>
      store.assignDeployment('person', {
        personnel_id: 'person',
        deployment_id: 'deployment',
      }),
  },
  {
    name: 'engagement',
    run: (store: ReturnType<typeof useAssignments>) =>
      store.assignEngagement('person', {
        personnel_id: 'person',
        engagement_id: 'engagement',
      }),
  },
  {
    name: 'training',
    run: (store: ReturnType<typeof useAssignments>) =>
      store.assignTraining('person', {
        personnelId: 'person',
        trainingId: 'training',
      }),
  },
  {
    name: 'equipment',
    run: (store: ReturnType<typeof useAssignments>) =>
      store.assignEquipment('person', {
        equipmentAssetId: 'asset',
        equipmentAssetStatusId: 'issued',
        issuedToPersonnelId: 'person',
        issuedByPersonnelId: 'issuer',
        issueDate: '2026-10-04',
        quantityIssued: 1,
        statusId: 'issued',
      }),
  },
]

describe.each(assignments)('$name assignment', ({ run }) => {
  const request = vi.fn()
  beforeEach(() => {
    setActivePinia(createPinia())
    request.mockReset()
    vi.stubGlobal('$fetch', request)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('submits once and exposes completion through the composable', async () => {
    const page = useAssignments()
    request.mockResolvedValue({ ok: true })
    await run(page)
    expect(request).toHaveBeenCalledTimes(1)
    expect(page.isSubmitting.value).toBe(false)
    expect(page.error.value).toBe('')
    expect(useAssignmentsStore().hasError).toBe(false)
  })

  it('records rejected requests, clears submitting state, and allows clearing feedback', async () => {
    const page = useAssignments()
    const error = Object.assign(new Error('failed'), {
      statusMessage: 'Assignment rejected',
    })
    request.mockRejectedValue(error)
    await expect(run(page)).rejects.toBe(error)
    expect(page.isSubmitting.value).toBe(false)
    expect(page.error.value).toBe('Assignment rejected')
    expect(useAssignmentsStore().hasError).toBe(true)
    page.clearError()
    expect(page.error.value).toBe('')
  })
})
