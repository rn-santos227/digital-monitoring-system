import { createError } from 'h3'

interface PersonnelExistenceSupabaseClient {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
      }
    }
  }
}

export const assertPersonnelExists = async (args: {
  supabase: unknown
  personnelId: string
  idSelectColumns: string
}): Promise<void> => {
  const supabaseClient = args.supabase as PersonnelExistenceSupabaseClient

  const { data: personnel, error } = await supabaseClient
    .from('personnel')
    .select(args.idSelectColumns)
    .eq('id', args.personnelId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate personnel record: ${error.message}` })
  }

  if (!personnel) {
    throw createError({ statusCode: 404, statusMessage: 'Personnel record not found.' })
  }
}
