import { createCachedNotification } from './createCachedNotification'

export const notifyPersonnelAssigned = (input: {
  personnelName: string | null
  personnelCode: string | null
  unitName: string
  unitType: 'battalion' | 'company'
  personnelId: string
}) => {
  const personnelLabel = input.personnelName ?? input.personnelCode ?? 'Personnel'

}
