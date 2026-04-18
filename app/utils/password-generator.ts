const DEFAULT_PASSWORD_LENGTH = 14
const PASSWORD_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?'

const getRandomIndex = (upperBound: number): number => {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const randomBuffer = new Uint32Array(1)
    crypto.getRandomValues(randomBuffer)
    const randomValue = randomBuffer[0] ?? 0
    return randomValue % upperBound
  }

  return Math.floor(Math.random() * upperBound)
}

export const generateUserPassword = (length = DEFAULT_PASSWORD_LENGTH): string => {
  const normalizedLength = Number.isInteger(length) && length >= 8 ? length : DEFAULT_PASSWORD_LENGTH

  return Array.from({ length: normalizedLength }, () => {
    const index = getRandomIndex(PASSWORD_CHARACTERS.length)
    return PASSWORD_CHARACTERS[index] ?? 'A'
  }).join('')
}
