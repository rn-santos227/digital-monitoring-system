import { createError } from 'h3'
import type {
  CreateEquipmentIncidentRequest,
  UpdateEquipmentIncidentRequest,
} from '../../requests'
import type {
  EquipmentIncidentCreate,
  EquipmentIncidentUpdate,
} from '../../models'
import { normalizeOptionalText } from '../../utils'
import {
  INCIDENT_DEFAULT_PAGE_SIZE,
  INCIDENT_MAX_PAGE_SIZE,
} from '../../constants'