import type { Ref } from 'vue'
import type { EquipmentIncidentSearchQuery } from '~/types/domain/incident'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

export const useIncidentSearchHandlers = (
  filters: Ref<Partial<EquipmentIncidentSearchQuery>>,
) => {

}
