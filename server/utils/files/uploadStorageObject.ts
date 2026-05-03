import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

interface UploadStorageObjectParams {
  bucket: string
  path: string
  data: ArrayBuffer | Uint8Array
  contentType?: string
}

export async function uploadStorageObject(supabase: SupabaseClient, params: UploadStorageObjectParams): Promise<void> {
  const { bucket, path, data, contentType } = params

  const { error } = await supabase
    .storage
    .from(bucket)
    .upload(path, data, {
      contentType,
      upsert: false,
    })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to upload file: ${error.message}` })
  }
}
