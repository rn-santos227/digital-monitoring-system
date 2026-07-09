import { computed, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '~/stores/notifications'

export const useNotifications = () => {
  const notificationStore = useNotificationStore()
  const { items, unreadCount, isLoading, isMarkingRead } = storeToRefs(notificationStore)
  let refreshInterval: ReturnType<typeof window.setInterval> | null = null

  const unreadCountLabel = computed(() => unreadCount.value > 99 ? '99+' : String(unreadCount.value))

  const fetchNotifications = async () => {
    await notificationStore.fetchNotifications()
  }

}
