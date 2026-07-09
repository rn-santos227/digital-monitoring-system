import { defineStore } from 'pinia'
import type { NotificationState } from '~/types/domain/notification'
import { getNotificationsEndpoint, markNotificationsReadEndpoint } from '~/utils/notification-endpoints'

