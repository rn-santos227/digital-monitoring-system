import { computed, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '~/stores/notifications'

export const useNotifications = () => {
  const notificationStore = useNotificationStore()
  const { items, unreadCount, isLoading, isMarkingRead } = storeToRefs(notificationStore)
  let refreshInterval: number | null = null

  const unreadCountLabel = computed(() => unreadCount.value > 99 ? '99+' : String(unreadCount.value))

  const fetchNotifications = async () => {
    await notificationStore.fetchNotifications()
  }

  const markAllRead = async () => {
    await notificationStore.markAllRead()
  }

  const formatNotificationDate = (value: string) => {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value))
  }

  onMounted(async () => {
    await fetchNotifications()
    refreshInterval = window.setInterval(() => {
      void fetchNotifications()
    }, 30000)
  })

  onBeforeUnmount(() => {
    if (refreshInterval) {
      window.clearInterval(refreshInterval)
    }
  })
}
