import { defineStore } from 'pinia'
import type { DefineStoreOptions } from 'pinia'
import type { NotificationState } from '~/types/domain/notification'
import { getNotificationsEndpoint, markNotificationsReadEndpoint } from '~/utils/notification-endpoints'

const INITIAL_NOTIFICATION_STATE: NotificationState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  isMarkingRead: false,
}

interface NotificationGetters {
  hasUnreadNotifications: (state: NotificationState) => boolean
  recentNotifications: (state: NotificationState) => NotificationState['items']
}

interface NotificationActions {
  fetchNotifications(): Promise<void>
  markAllRead(): Promise<void>
}

const notificationStoreOptions: DefineStoreOptions<
  'notifications',
  NotificationState,
  NotificationGetters,
  NotificationActions
> = {
  id: 'notifications',
  state: (): NotificationState => ({ ...INITIAL_NOTIFICATION_STATE }),

  getters: {
    hasUnreadNotifications: (state: NotificationState) => state.unreadCount > 0,
    recentNotifications: (state: NotificationState) => state.items,
  },

  actions: {
    async fetchNotifications(this: NotificationState) {
      this.isLoading = true

      try {
        const response = await getNotificationsEndpoint()
        this.items = response.items
        this.unreadCount = response.unreadCount
      } finally {
        this.isLoading = false
      }
    },

    async markAllRead(this: NotificationState) {
      this.isMarkingRead = true

      try {
        await markNotificationsReadEndpoint()
        this.items = this.items.map(item => ({ ...item, isRead: true }))
        this.unreadCount = 0
      } finally {
        this.isMarkingRead = false
      }
    },
  },
}

export const useNotificationStore = defineStore('notifications', notificationStoreOptions)
