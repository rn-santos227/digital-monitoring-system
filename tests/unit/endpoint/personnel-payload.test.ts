import { describe, expect, it } from 'vitest'

import {
  buildPersonnelUpdates,
  parseCreatePersonnelPayload,
} from '../../../../server/shared/validations/domain/personnel-management'

escribe('personnel endpoint payloads', () => {
  it('normalizes a create request into persistence columns', () => {
    const payload = parseCreatePersonnelPayload({
      personnelCode: ' AFP-001 ',
      serviceNumber: ' SN-001 ',
      email: ' soldier@example.mil ',
      lastName: ' Dela Cruz ',
      firstName: ' Juan ',
      sex: 'Male',
      rankId: 'rank-1',
      battalionId: ' battalion-1 ',
      employmentStatusId: 'employment-active',
      serviceStatusId: 'service-ready',
    })

  }
})
