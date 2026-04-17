import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUpdateSettingsHandler } from '@/app/handlers/settings/update.handler'
import { useProfileSettingsUpdateHandler } from '@/app/handlers/profile/update.handler'
import { settingsFixture } from '@/tests/helpers/settings-fixture'

const { showDialog } = vi.hoisted(() => ({ showDialog: vi.fn() }))
vi.mock('@/app/composables/useDialog', () => ({
  useDialog: () => ({ showDialog }),
}))

beforeEach(() => {
  showDialog.mockReset().mockResolvedValue({ confirmed: true })
})

describe('settings update feedback', () => {
  const setup = (allowed = true) => {
    const update = vi.fn().mockResolvedValue(undefined)
    const payload = { ...settingsFixture }
    const toUpdatePayload = vi.fn(() => payload)
    const controller = useUpdateSettingsHandler({
      canUpdate: ref(allowed),
      toUpdatePayload,
      updateApplicationSettings: update,
    })
    return { controller, update, payload, toUpdatePayload }
  }

  it('blocks updates without permission', async () => {
    const { controller, update, payload } = setup(false)
    await controller.onUpdateSettings(payload)
    expect(update).not.toHaveBeenCalled()
    expect(controller.errorMessage.value).toMatch(/privilege is required/)
  })

  it('keeps validation errors inline without contacting the endpoint', async () => {
    const { controller, update, payload } = setup()
    await controller.onUpdateSettings({ ...payload, appName: '' })
    expect(update).not.toHaveBeenCalled()
    expect(controller.validationError.value).toMatch(/required/)
    expect(controller.dangerMessage.value).toBe(
      controller.validationError.value,
    )
    expect(showDialog).not.toHaveBeenCalled()
  })

  it('submits the current form once and clears previous feedback', async () => {
    const { controller, update, payload, toUpdatePayload } = setup()
    controller.errorMessage.value = 'Previous error'
    controller.dangerMessage.value = 'Previous validation'
    await controller.onSubmit()
    expect(toUpdatePayload).toHaveBeenCalledOnce()
    expect(update).toHaveBeenCalledExactlyOnceWith(payload)
    expect(controller.errorMessage.value).toBe('')
    expect(controller.dangerMessage.value).toBe('')
    expect(controller.infoMessage.value).toMatch(/updated successfully/)
    expect(showDialog).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success' }),
    )
  })

  it('shows inline and dialog errors after an API failure', async () => {
    const { controller, update } = setup()
    update.mockRejectedValue(new Error('Save rejected'))
    await controller.onSubmit()
    expect(controller.errorMessage.value).toBe('Save rejected')
    expect(controller.infoMessage.value).toBe('')
    expect(showDialog).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', message: 'Save rejected' }),
    )
  })
})

describe('profile settings update feedback', () => {
  const setup = () => {
    const options = {
      refreshSession: vi.fn().mockResolvedValue(undefined),
      saveDetails: vi.fn().mockResolvedValue(undefined),
      saveEmail: vi.fn().mockResolvedValue(undefined),
      saveOtherDetails: vi.fn().mockResolvedValue(undefined),
      savePassword: vi.fn().mockResolvedValue(undefined),
    }
    return { options, controller: useProfileSettingsUpdateHandler(options) }
  }

  it.each(['Details', 'Email', 'OtherDetails', 'Password'] as const)(
    'refreshes session after saving %s',
    async (section) => {
      const { options, controller } = setup()
      const payload = {
        fullName: 'Unit User',
        email: 'unit@example.test',
        avatarUrl: null,
        currentPassword: 'Old-password1!',
        newPassword: 'Valid-password1!',
      }
      await controller[`onSave${section}`](payload)
      expect(options[`save${section}`]).toHaveBeenCalledExactlyOnceWith(payload)
      expect(options.refreshSession).toHaveBeenCalledOnce()
      expect(showDialog).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'success' }),
      )
    },
  )

  it.each(['Details', 'Email', 'OtherDetails', 'Password'] as const)(
    'reports failed %s saves without refreshing the session',
    async (section) => {
      const { options, controller } = setup()
      options[`save${section}`].mockRejectedValue(new Error('Profile rejected'))
      await controller[`onSave${section}`]({
        fullName: 'Unit User',
        email: 'unit@example.test',
        avatarUrl: null,
        currentPassword: 'Old-password1!',
        newPassword: 'Valid-password1!',
      })
      expect(options.refreshSession).not.toHaveBeenCalled()
      expect(showDialog).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'error', message: 'Profile rejected' }),
      )
    },
  )

  it('does not change the password when confirmation is cancelled', async () => {
    const { options, controller } = setup()
    showDialog.mockResolvedValue({ confirmed: false })
    await controller.onSavePassword({
      currentPassword: 'Old-password1!',
      newPassword: 'Valid-password1!',
    })
    expect(options.savePassword).not.toHaveBeenCalled()
    expect(options.refreshSession).not.toHaveBeenCalled()
  })
})
