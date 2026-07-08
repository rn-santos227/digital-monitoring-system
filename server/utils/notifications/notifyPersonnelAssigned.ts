import { createCachedNotification } from './createCachedNotification'

export const notifyPersonnelAssigned = (input: {
  personnelName: string | null
  personnelCode: string | null
  unitName: string
  unitType: 'battalion' | 'company'
  personnelId: string
}) => {
  const personnelLabel = input.personnelName ?? input.personnelCode ?? 'Personnel'

  createCachedNotification({
    type: 'personnel-assignment',
    title: 'Personnel assigned',
    message: `${personnelLabel} has been assigned to ${input.unitName} ${input.unitType}.`,
    sourceId: input.personnelId,
    sourcePath: `/personnel/${input.personnelId}`,
  })
}
