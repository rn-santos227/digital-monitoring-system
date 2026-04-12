import { useDialog } from '~/composables/useDialog'
import {
  DASHBOARD_LOGOUT_DIALOG_CANCEL_LABEL,
  DASHBOARD_LOGOUT_DIALOG_CONFIRM_LABEL,
  DASHBOARD_LOGOUT_DIALOG_MESSAGE,
  DASHBOARD_LOGOUT_DIALOG_TITLE,
} from '~/constants/page.constants'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import { useAuthStore } from '~/stores/auth'

export const useDefaultLayoutHandlers = () => {
  const { showDialog } = useDialog()
  const authStore = useAuthStore()

  const handleLogout = async () => {
    const result = await showDialog({
      type: 'question',
      title: DASHBOARD_LOGOUT_DIALOG_TITLE,
      message: DASHBOARD_LOGOUT_DIALOG_MESSAGE,
      confirmLabel: DASHBOARD_LOGOUT_DIALOG_CONFIRM_LABEL,
      cancelLabel: DASHBOARD_LOGOUT_DIALOG_CANCEL_LABEL,
    })

    if (!result.confirmed) {
      return
    }

    await authStore.logout()
    await navigateTo(ROUTE_PATHS.login)
  }

  return {
    handleLogout,
  }
}
