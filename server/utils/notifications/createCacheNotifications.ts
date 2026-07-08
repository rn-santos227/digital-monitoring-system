import { randomUUID } from 'node:crypto'
import type { AppNotification, CreateNotificationInput } from '../../shared/models'
import { NOTIFICATION_CACHE_MAX_ITEMS, NOTIFICATION_CACHE_TTL_MS } from '../../shared/constants'
import { notifications } from '../../shared/utils'
import { pruneExpiredNotifications } from './pruneExpiredNotifications'


