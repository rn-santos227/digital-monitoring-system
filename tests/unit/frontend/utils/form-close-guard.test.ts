import { describe, expect, it, vi } from 'vitest'

import {
  requestCloseForChangedValues,
  requestCloseForRequiredFields,
  resetFormValues,
} from '@/app/utils/form-close-guard'

describe('unsaved form close guards', () => {
  it('closes empty or unchanged create forms without a dialog', async () => {
    const showDialog = vi.fn()
    expect(
      await requestCloseForRequiredFields({
        formValues: { name: ' ', active: true },
        showDialog,
      }),
    ).toBe(true)
    expect(
      await requestCloseForRequiredFields({
        formValues: { name: 'Default' },
        initialValues: { name: 'Default' },
        showDialog,
      }),
    ).toBe(true)
    expect(showDialog).not.toHaveBeenCalled()
  })

  it.each([true, false])(
    'respects the discard decision %s for entered content',
    async (confirmed) => {
      const showDialog = vi.fn().mockResolvedValue({ confirmed })
      expect(
        await requestCloseForRequiredFields({
          formValues: { name: 'Entered' },
          requiredKeys: ['name'],
          showDialog,
        }),
      ).toBe(confirmed)
      expect(showDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'question',
          cancelLabel: 'Continue editing',
        }),
      )
    },
  )

  it('supports forced confirmation and explicit required fields', async () => {
    const showDialog = vi.fn().mockResolvedValue({ confirmed: false })
    expect(
      await requestCloseForRequiredFields({
        formValues: { optional: 'text' },
        requiredKeys: ['required'],
        showDialog,
      }),
    ).toBe(true)
    expect(
      await requestCloseForRequiredFields({
        formValues: {},
        shouldConfirmWhenEmpty: true,
        showDialog,
      }),
    ).toBe(false)
    expect(showDialog).toHaveBeenCalledOnce()
  })

  it('compares scalar and array values without prompting for equivalent forms', async () => {
    const showDialog = vi.fn()
    expect(
      await requestCloseForChangedValues({
        formValues: { ids: ['a', 'b'], name: 'Jane' },
        originalValues: { ids: ['a', 'b'], name: 'Jane' },
        showDialog,
      }),
    ).toBe(true)
    expect(
      await requestCloseForChangedValues({
        formValues: { name: 'Changed', ignored: 2 },
        originalValues: { name: 'Jane', ignored: 2 },
        keysToCompare: ['ignored'],
        showDialog,
      }),
    ).toBe(true)
    expect(showDialog).not.toHaveBeenCalled()
  })

  it.each([
    [{ ids: ['a'] }, { ids: ['b'] }],
    [{ ids: ['a'] }, { ids: ['a', 'b'] }],
    [{ ids: ['a'] }, { ids: 'a' }],
    [{ name: 'New' }, {}],
  ])('prompts for a changed form %j', async (formValues, originalValues) => {
    const showDialog = vi.fn().mockResolvedValue({ confirmed: false })
    expect(
      await requestCloseForChangedValues({
        formValues,
        originalValues,
        showDialog,
      }),
    ).toBe(false)
    expect(showDialog).toHaveBeenCalledOnce()
  })

  it('restores values while copying arrays and normalizing undefined', () => {
    const original = { name: 'Jane', ids: ['a'], absent: undefined }
    const target = {
      name: 'Changed',
      ids: ['b'],
      absent: 'value' as string | null,
    }
    resetFormValues(target, original)
    expect(target).toEqual({ name: 'Jane', ids: ['a'], absent: null })
    expect(target.ids).not.toBe(original.ids)
  })
})
