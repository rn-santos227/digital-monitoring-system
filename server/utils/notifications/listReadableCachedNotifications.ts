import { PERMISSION_CODES } from '../../shared/constants'
import { listCachedNotifications } from './listCachedNotifications'

const canReadNotification = (notificationType: string, permissionCodes: string[]) => {
  if (notificationType === 'training-schedule') {
    return permissionCodes.includes(PERMISSION_CODES.trainingView)
  }

}
