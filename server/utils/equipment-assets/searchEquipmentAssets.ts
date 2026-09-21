import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ASSET_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentAssetRow, PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchEquipmentAssetsOptions {
  searchFilters: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  rangeFrom: number
  rangeTo: number
}


