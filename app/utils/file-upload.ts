export const isFileMimeTypeAllowed = (file: File, allowedMimePrefixes: string[]): boolean => {
  if (allowedMimePrefixes.length === 0) {
    return true
  }

  const normalizedMimeType = file.type.trim().toLowerCase()

  if (!normalizedMimeType) {
    return false
  }

  return allowedMimePrefixes.some((prefix) => normalizedMimeType.startsWith(prefix.trim().toLowerCase()))
}

export const formatFileSizeLabel = (sizeBytes: number): string => {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`
  }

  const sizeKb = sizeBytes / 1024

  if (sizeKb < 1024) {
    return `${sizeKb.toFixed(0)} KB`
  }

  const sizeMb = sizeKb / 1024
  return `${sizeMb.toFixed(1)} MB`
}
