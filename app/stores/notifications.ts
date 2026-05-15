import { defineStore } from 'pinia'
import type { NotificationState } from '~/types/domain/notification'
import { getNotificationsEndpoint, markNotificationsReadEndpoint } from '~/utils/notification-endpoints'

const INITIAL_NOTIFICATION_STATE: NotificationState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  isMarkingRead: false,
}

const notificationStoreOptions = {
  state: (): NotificationState => ({
    ...INITIAL_NOTIFICATION_STATE,
    items: [],
  }),

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

    replaceFromStream(this: NotificationState, response: Pick<NotificationState, 'items' | 'unreadCount'>) {
      this.items = response.items
      this.unreadCount = response.unreadCount
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
