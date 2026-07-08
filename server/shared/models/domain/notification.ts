export type NotificationType = 'personnel-assignment' | 'training-schedule' | 'engagement-schedule' | 'incident-recorded'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  sourceId: string | null
  sourcePath: string | null
  createdAt: string
  expiresAt: string
  readByUserIds: string[]
}
