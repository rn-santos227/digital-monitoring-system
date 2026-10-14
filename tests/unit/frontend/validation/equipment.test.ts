import { describe, expect, it } from 'vitest'

import {
  validateCreateEquipmentAssetForm,
  validateCreateEquipmentCategoryForm,
  validateCreateEquipmentItemForm,
  validateCreateEquipmentIssuanceForm,
  validateUpdateEquipmentAssetForm,
  validateUpdateEquipmentCategoryForm,
  validateUpdateEquipmentItemForm,
  validateUpdateEquipmentIssuanceForm,
} from '@/app/utils/equipment-validation'
import { defineFormContractTests } from '@/tests/helpers/form-contract'

const category = { code: ' gear ', name: ' Gear ', isActive: true }
const item = {
  equipmentCode: ' EQ-01 ',
  categoryId: 'category',
  name: ' Radio ',
  model: '',
  manufacturer: '',
  description: '',
  unitOfMeasure: '',
  minimumStockLevel: 2,
  isSerialized: true,
  isActive: true,
}
const asset = {
  assetTag: ' AS-01 ',
  equipmentItemId: 'item',
  serialNo: '',
  batchNo: '',
  procurementDate: '',
  acquisitionCost: null,
  fundSource: '',
  currentLocation: '',
  conditionStatusId: '',
  serviceabilityStatusId: '',
  assetStatusId: 'status',
  remarks: '',
}
const issuance = {
  equipmentAssetId: 'asset',
  equipmentAssetStatusId: 'asset-status',
  issuedToPersonnelId: 'recipient',
  issuedByPersonnelId: 'issuer',
  deploymentId: '',
  issueDate: '2026-10-04',
  expectedReturnDate: '',
  actualReturnDate: '',
  quantityIssued: 1,
  statusId: 'status',
  issuedLocation: '',
  returnLocation: '',
  remarks: '',
}

for (const [name, validate] of [
  ['create', validateCreateEquipmentCategoryForm],
  ['update', validateUpdateEquipmentCategoryForm],
] as const) {
  defineFormContractTests({
    name: `${name} equipment category`,
    validate,
    form: category,
    required: ['code', 'name'],
    expected: { code: 'GEAR', name: 'Gear' },
  })
}
for (const [name, validate] of [
  ['create', validateCreateEquipmentItemForm],
  ['update', validateUpdateEquipmentItemForm],
] as const) {
  defineFormContractTests({
    name: `${name} equipment item`,
    validate,
    form: item,
    required: ['equipmentCode', 'categoryId', 'name'],
    optional: ['model', 'manufacturer', 'description', 'unitOfMeasure'],
    expected: { equipmentCode: 'EQ-01', name: 'Radio', minimumStockLevel: 2 },
  })
}
for (const [name, validate] of [
  ['create', validateCreateEquipmentAssetForm],
  ['update', validateUpdateEquipmentAssetForm],
] as const) {
  defineFormContractTests({
    name: `${name} equipment asset`,
    validate,
    form: asset,
    required: ['assetTag', 'equipmentItemId', 'assetStatusId'],
    optional: [
      'serialNo',
      'batchNo',
      'procurementDate',
      'fundSource',
      'currentLocation',
      'conditionStatusId',
      'serviceabilityStatusId',
      'remarks',
    ],
    expected: { assetTag: 'AS-01', acquisitionCost: null, serialNo: null },
  })
}
defineFormContractTests({
  name: 'create equipment issuance',
  validate: validateCreateEquipmentIssuanceForm,
  form: issuance,
  required: [
    'equipmentAssetId',
    'equipmentAssetStatusId',
    'issuedToPersonnelId',
    'issuedByPersonnelId',
    'issueDate',
    'statusId',
  ],
  optional: [
    'deploymentId',
    'expectedReturnDate',
    'actualReturnDate',
    'issuedLocation',
    'returnLocation',
    'remarks',
  ],
  expected: { quantityIssued: 1, deploymentId: null },
})
defineFormContractTests({
  name: 'update equipment issuance',
  validate: validateUpdateEquipmentIssuanceForm,
  form: issuance,
  required: [
    'equipmentAssetId',
    'issuedToPersonnelId',
    'issuedByPersonnelId',
    'issueDate',
    'statusId',
  ],
  optional: [
    'deploymentId',
    'expectedReturnDate',
    'actualReturnDate',
    'issuedLocation',
    'returnLocation',
    'remarks',
  ],
  expected: { quantityIssued: 1, remarks: null },
})

describe('equipment numeric and date constraints', () => {
  it.each([-1, 1.001, 1000000000000, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects acquisition cost %s',
    (acquisitionCost) => {
      expect(
        validateCreateEquipmentAssetForm({ ...asset, acquisitionCost }).payload,
      ).toBeNull()
    },
  )

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects issued quantity %s',
    (quantityIssued) => {
      expect(
        validateCreateEquipmentIssuanceForm({ ...issuance, quantityIssued })
          .payload,
      ).toBeNull()
      expect(
        validateUpdateEquipmentIssuanceForm({ ...issuance, quantityIssued })
          .payload,
      ).toBeNull()
    },
  )

  it('rejects return dates before issuance and accepts zero acquisition cost', () => {
    expect(
      validateCreateEquipmentAssetForm({ ...asset, acquisitionCost: 0 }).payload
        ?.acquisitionCost,
    ).toBe(0)
    expect(
      validateCreateEquipmentIssuanceForm({
        ...issuance,
        expectedReturnDate: '2026-10-03',
      }).errors.expectedReturnDate,
    ).toBeTruthy()
    expect(
      validateUpdateEquipmentIssuanceForm({
        ...issuance,
        expectedReturnDate: '2026-10-03',
      }).errors.expectedReturnDate,
    ).toBeTruthy()
    expect(
      validateUpdateEquipmentIssuanceForm({
        ...issuance,
        actualReturnDate: '2026-10-03',
      }).errors.actualReturnDate,
    ).toBeTruthy()
  })
})
