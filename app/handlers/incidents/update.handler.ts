import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type {
  EquipmentIncidentTableRow,
  UpdateEquipmentIncidentDeploymentPayload,
  UpdateEquipmentIncidentDetailsPayload,
  UpdateEquipmentIncidentEquipmentPayload,
  UpdateEquipmentIncidentPersonnelPayload,
  UpdateEquipmentIncidentLocationPayload,
  UpdateEquipmentIncidentStatusPayload,
} from '~/types/domain/incident'
import { extractApiErrorMessage } from '~/utils/api-request'

