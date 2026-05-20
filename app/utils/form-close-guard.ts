import type { DialogInput } from '~/composables/useDialog'

type FormFieldValue = string | number | boolean | null | undefined | unknown[]

type RequestCloseForRequiredFieldsInput = {
  formValues: Record<string, FormFieldValue>
  requiredKeys?: string[]
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

