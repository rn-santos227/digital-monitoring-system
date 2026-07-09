import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

export const useNotificationMenuHandler = () => {
  const {
    items,
    unreadCount,
    unreadCountLabel,
    isLoading,
    isMarkingRead,
    fetchNotifications,
    markAllRead,
    formatNotificationDate,
  } = useNotifications()
}
