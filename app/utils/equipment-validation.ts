import type {
  CreateEquipmentAssetPayload,
  CreateEquipmentCategoryPayload,
  CreateEquipmentIssuancePayload,
  UpdateEquipmentCategoryPayload,
  UpdateEquipmentAssetPayload,
  UpdateEquipmentIssuancePayload,
} from '~/types/domain/equipment'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

export const validateCreateEquipmentCategoryForm = (form: {
  code: string
  name: string
  isActive: boolean
}) => {
  const result = validateFields([
    {
      field: 'code',
      label: 'Category code',
      value: form.code,
      required: true,
      maxLength: 32,
      pattern: REGEX_PATTERNS.categoryCode,
      patternMessage: 'Category code allows letters, numbers, underscores, and hyphens only.',
    },
    {
      field: 'name',
      label: 'Category name',
      value: form.name,
      required: true,
      maxLength: 120,
    },
  ])

  const payload: CreateEquipmentCategoryPayload | null = Object.keys(result.errors).length === 0
    ? {
      code: (result.values.code ?? '').toUpperCase(),
      name: result.values.name ?? '',
      isActive: form.isActive,
    }
    : null

  return {
    errors: result.errors,
    payload,
  }
}

export const validateUpdateEquipmentCategoryForm = validateCreateEquipmentCategoryForm as (form: {
  code: string
  name: string
  isActive: boolean
}) => {
  errors: Record<string, string>
  payload: UpdateEquipmentCategoryPayload | null
}

export const validateCreateEquipmentItemForm = (form: {
  equipmentCode: string
  categoryId: string
  name: string
  model: string
  manufacturer: string
  description: string
  unitOfMeasure: string
  minimumStockLevel: number
  isSerialized: boolean
  isActive: boolean
}) => {
  const result = validateFields([
    { field: 'equipmentCode', label: 'Equipment code', value: form.equipmentCode, required: true, maxLength: 40 },
    { field: 'categoryId', label: 'Equipment category', value: form.categoryId, required: true },
    { field: 'name', label: 'Item name', value: form.name, required: true, maxLength: 160 },
  ])

  return {
    errors: result.errors,
    payload: Object.keys(result.errors).length === 0 ? {
      equipmentCode: result.values.equipmentCode ?? '',
      categoryId: result.values.categoryId ?? '',
      name: result.values.name ?? '',
      model: form.model || undefined,
      manufacturer: form.manufacturer || undefined,
      description: form.description || undefined,
      unitOfMeasure: form.unitOfMeasure || undefined,
      minimumStockLevel: Number(form.minimumStockLevel) || 0,
      isSerialized: form.isSerialized,
      isActive: form.isActive,
    } : null,
  }
}

export const validateUpdateEquipmentItemForm = validateCreateEquipmentItemForm

export const validateCreateEquipmentAssetForm = (form: {
  assetTag: string
  equipmentItemId: string
  serialNo: string
  batchNo: string
  procurementDate: string
  acquisitionCost: number | null
  fundSource: string
  currentLocation: string
  conditionStatusId: string
  serviceabilityStatusId: string
  assetStatusId: string
  remarks: string
}) => {
  const result = validateFields([
    { field: 'assetTag', label: 'Asset tag', value: form.assetTag, required: true, maxLength: 80 },
    { field: 'equipmentItemId', label: 'Equipment item', value: form.equipmentItemId, required: true },
    { field: 'assetStatusId', label: 'Asset status', value: form.assetStatusId, required: true },
  ])

  const errors = { ...result.errors }
  const acquisitionCost = form.acquisitionCost

  if (acquisitionCost !== null && (!Number.isFinite(acquisitionCost) || acquisitionCost < 0)) {
    errors.acquisitionCost = 'Acquisition cost must be a non-negative number.'
  }

  const payload: CreateEquipmentAssetPayload | null = Object.keys(errors).length === 0
    ? {
      assetTag: result.values.assetTag ?? '',
      equipmentItemId: result.values.equipmentItemId ?? '',
      serialNo: form.serialNo || null,
      batchNo: form.batchNo || null,
      procurementDate: form.procurementDate || null,
      acquisitionCost,
      fundSource: form.fundSource || null,
      currentLocation: form.currentLocation || null,
      conditionStatusId: form.conditionStatusId || null,
      serviceabilityStatusId: form.serviceabilityStatusId || null,
      assetStatusId: result.values.assetStatusId ?? '',
      remarks: form.remarks || null,
    }
    : null

  return {
    errors,
    payload,
  }
}

export const validateUpdateEquipmentAssetForm = validateCreateEquipmentAssetForm as (form: {
  assetTag: string
  equipmentItemId: string
  serialNo: string
  batchNo: string
  procurementDate: string
  acquisitionCost: number | null
  fundSource: string
  currentLocation: string
  conditionStatusId: string
  serviceabilityStatusId: string
  assetStatusId: string
  remarks: string
}) => {
  errors: Record<string, string>
  payload: UpdateEquipmentAssetPayload | null
}

export const validateCreateEquipmentIssuanceForm = (form: {
  equipmentAssetId: string
  equipmentAssetStatusId: string
  issuedToPersonnelId: string
  issuedByPersonnelId: string
  deploymentId: string
  issueDate: string
  expectedReturnDate: string
  actualReturnDate: string
  quantityIssued: number
  statusId: string
  issuedLocation: string
  returnLocation: string
  remarks: string
}) => {
  const result = validateFields([
    { field: 'equipmentAssetId', label: 'Equipment asset', value: form.equipmentAssetId, required: true },
    { field: 'equipmentAssetStatusId', label: 'Equipment status', value: form.equipmentAssetStatusId, required: true },
    { field: 'issuedToPersonnelId', label: 'Issued to personnel', value: form.issuedToPersonnelId, required: true },
    { field: 'issuedByPersonnelId', label: 'Issued by personnel', value: form.issuedByPersonnelId, required: true },
    { field: 'issueDate', label: 'Issue date', value: form.issueDate, required: true },
    { field: 'statusId', label: 'Issuance status', value: form.statusId, required: true },
  ])

  const errors = { ...result.errors }
  const quantityIssued = Math.trunc(Number(form.quantityIssued))

  if (!Number.isFinite(quantityIssued) || quantityIssued <= 0) {
    errors.quantityIssued = 'Quantity issued must be a positive whole number.'
  }

  if (form.expectedReturnDate && form.issueDate && form.expectedReturnDate < form.issueDate) {
    errors.expectedReturnDate = 'Expected return date cannot be earlier than the issue date.'
  }

  const payload: CreateEquipmentIssuancePayload | null = Object.keys(errors).length === 0
    ? {
      equipmentAssetId: result.values.equipmentAssetId ?? '',
      equipmentAssetStatusId: result.values.equipmentAssetStatusId ?? '',
      issuedToPersonnelId: result.values.issuedToPersonnelId ?? '',
      issuedByPersonnelId: result.values.issuedByPersonnelId ?? '',
      deploymentId: form.deploymentId || null,
      issueDate: result.values.issueDate ?? '',
      expectedReturnDate: form.expectedReturnDate || null,
      actualReturnDate: form.actualReturnDate || null,
      quantityIssued,
      statusId: result.values.statusId ?? '',
      issuedLocation: form.issuedLocation || null,
      returnLocation: form.returnLocation || null,
      remarks: form.remarks || null,
    }
    : null

  return {
    errors,
    payload,
  }
}

export const validateUpdateEquipmentIssuanceForm = (form: {
  equipmentAssetId: string
  issuedToPersonnelId: string
  issuedByPersonnelId: string
  deploymentId: string
  issueDate: string
  expectedReturnDate: string
  actualReturnDate: string
  quantityIssued: number
  statusId: string
  issuedLocation: string
  returnLocation: string
  remarks: string
}) => {
  const result = validateFields([
    { field: 'equipmentAssetId', label: 'Equipment asset', value: form.equipmentAssetId, required: true },
    { field: 'issuedToPersonnelId', label: 'Issued to personnel', value: form.issuedToPersonnelId, required: true },
    { field: 'issuedByPersonnelId', label: 'Issued by personnel', value: form.issuedByPersonnelId, required: true },
    { field: 'issueDate', label: 'Issue date', value: form.issueDate, required: true },
    { field: 'statusId', label: 'Issuance status', value: form.statusId, required: true },
  ])

  const errors = { ...result.errors }
  const quantityIssued = Math.trunc(Number(form.quantityIssued))

  if (!Number.isFinite(quantityIssued) || quantityIssued <= 0) {
    errors.quantityIssued = 'Quantity issued must be a positive whole number.'
  }

  if (form.expectedReturnDate && form.issueDate && form.expectedReturnDate < form.issueDate) {
    errors.expectedReturnDate = 'Expected return date cannot be earlier than the issue date.'
  }

  if (form.actualReturnDate && form.issueDate && form.actualReturnDate < form.issueDate) {
    errors.actualReturnDate = 'Actual return date cannot be earlier than the issue date.'
  }
}
