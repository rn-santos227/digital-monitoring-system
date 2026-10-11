import { describe, expect, it } from 'vitest'

import {
  validateCreateEquipmentIncidentForm,
  validateUpdateEquipmentIncidentDetailsForm,
  validateUpdateEquipmentIncidentDeploymentForm,
  validateUpdateEquipmentIncidentEquipmentForm,
  validateUpdateEquipmentIncidentLocationForm,
  validateUpdateEquipmentIncidentPersonnelForm,
  validateUpdateEquipmentIncidentStatusForm,
} from '@/app/utils/incident-validation'
import { defineFormContractTests } from '@/tests/helpers/form-contract'

const form = {
  incidentNo: ' IN-01 ',
  equipmentAssetId: 'asset',
  personnelId: '',
  deploymentId: '',
  incidentTypeId: 'type',
  incidentDate: '2026-10-04',
  location: '',
  locationLatitude: null,
  locationLongitude: null,
  description: ' Equipment damaged ',
  investigationStatusId: '',
  resolution: '',
  remarks: '',
}

defineFormContractTests({
  name: 'create incident',
  validate: validateCreateEquipmentIncidentForm,
  form,
  required: [
    'incidentNo',
    'equipmentAssetId',
    'incidentTypeId',
    'incidentDate',
    'description',
  ],
  optional: [
    'personnelId',
    'deploymentId',
    'location',
    'investigationStatusId',
    'resolution',
    'remarks',
  ],
  expected: {
    incidentNo: 'IN-01',
    description: 'Equipment damaged',
    personnelId: null,
  },
})
defineFormContractTests({
  name: 'update incident details',
  validate: validateUpdateEquipmentIncidentDetailsForm,
  form,
  required: ['incidentNo', 'incidentTypeId', 'incidentDate', 'description'],
  optional: ['resolution', 'remarks'],
  expected: { incidentNo: 'IN-01', resolution: null },
})
defineFormContractTests({
  name: 'update incident equipment',
  validate: validateUpdateEquipmentIncidentEquipmentForm,
  form: { equipmentAssetId: ' asset ' },
  required: ['equipmentAssetId'],
  expected: { equipmentAssetId: 'asset' },
})

describe('incident assignments and location', () => {
  it('sets or clears optional assignments and investigation status', () => {
    expect(
      validateUpdateEquipmentIncidentPersonnelForm({ personnelId: '' }).payload,
    ).toEqual({ personnelId: null })
    expect(
      validateUpdateEquipmentIncidentPersonnelForm({ personnelId: 'personnel' })
        .payload,
    ).toEqual({ personnelId: 'personnel' })
    expect(
      validateUpdateEquipmentIncidentDeploymentForm({ deploymentId: '' })
        .payload,
    ).toEqual({ deploymentId: null })
    expect(
      validateUpdateEquipmentIncidentDeploymentForm({
        deploymentId: 'deployment',
      }).payload,
    ).toEqual({ deploymentId: 'deployment' })
    expect(
      validateUpdateEquipmentIncidentStatusForm({ investigationStatusId: '' })
        .payload,
    ).toEqual({ investigationStatusId: null })
    expect(
      validateUpdateEquipmentIncidentStatusForm({
        investigationStatusId: 'open',
      }).payload,
    ).toEqual({ investigationStatusId: 'open' })
  })

  it.each([-91, 91, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects latitude %s in create and location update',
    (locationLatitude) => {
      expect(
        validateCreateEquipmentIncidentForm({ ...form, locationLatitude })
          .payload,
      ).toBeNull()
      expect(
        validateUpdateEquipmentIncidentLocationForm({
          ...form,
          locationLatitude,
        }).payload,
      ).toBeNull()
    },
  )

  it.each([-181, 181, Number.NaN, Number.NEGATIVE_INFINITY])(
    'rejects longitude %s in create and location update',
    (locationLongitude) => {
      expect(
        validateCreateEquipmentIncidentForm({ ...form, locationLongitude })
          .payload,
      ).toBeNull()
      expect(
        validateUpdateEquipmentIncidentLocationForm({
          ...form,
          locationLongitude,
        }).payload,
      ).toBeNull()
    },
  )

  it.each([-90, 0, 90])(
    'accepts boundary latitude %s and nullable locations',
    (locationLatitude) => {
      expect(
        validateUpdateEquipmentIncidentLocationForm({
          location: '',
          locationLatitude,
          locationLongitude: 180,
        }).payload,
      ).toEqual({ location: null, locationLatitude, locationLongitude: 180 })
      expect(validateUpdateEquipmentIncidentLocationForm(form).payload).toEqual(
        { location: null, locationLatitude: null, locationLongitude: null },
      )
    },
  )
})
