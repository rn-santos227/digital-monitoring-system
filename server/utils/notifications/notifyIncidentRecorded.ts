import type { EquipmentIncidentListItem } from '../../shared/models'
import { createCachedNotification } from './createCachedNotification'

export const notifyIncidentRecorded = (item: EquipmentIncidentListItem) => {
  createCachedNotification({
    type: 'incident-recorded',
    title: 'New incident recorded',
    message: `${item.incidentNo} was recorded for ${item.assetTag} at ${item.location ?? 'an unspecified location'}.`,
    sourceId: item.id,
    sourcePath: `/incidents/${item.id}`,
  })
}
