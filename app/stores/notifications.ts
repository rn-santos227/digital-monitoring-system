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

}

export const useNotificationStore = defineStore('notifications', notificationStoreOptions)
