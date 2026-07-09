export type NotificationType = 'personnel-assignment' | 'training-schedule' | 'engagement-schedule' | 'incident-recorded'

export interface NotificationListItem {
  id: string
  type: NotificationType
  title: string
  message: string
  sourceId: string | null
  sourcePath: string | null
  createdAt: string
  expiresAt: string
  isRead: boolean
}

export interface NotificationListResponse {
  items: NotificationListItem[]
  unreadCount: number
}

export interface NotificationState {
  items: NotificationListItem[]
  unreadCount: number
  isLoading: boolean
  isMarkingRead: boolean
}
