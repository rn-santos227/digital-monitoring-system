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

  const menuRoot = ref<HTMLElement | null>(null)
  const isOpen = ref(false)

  const closeMenu = () => {
    isOpen.value = false
  }

  const toggleMenu = async () => {
    isOpen.value = !isOpen.value

    if (isOpen.value) {
      await fetchNotifications()
    }
  }
}
