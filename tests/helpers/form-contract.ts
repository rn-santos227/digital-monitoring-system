import { describe, expect, it } from 'vitest'

export const defineFormContractTests = <TForm extends object>({
  name,
  validate,
  form,
  required,
  optional = [],
  expected,
}: {
  name: string
  validate: (form: TForm) => {
    payload: object | null
    errors: Record<string, string>
  }
  form: TForm
  required: Array<keyof TForm>
  optional?: Array<keyof TForm>
  expected: object
}) => {
  describe(name, () => {
    it('normalizes a valid form into the expected API payload', () => {
      const original = structuredClone(form)
      const result = validate(form)
      expect(result.errors).toEqual({})
      expect(result.payload).toMatchObject(expected)
      expect(form).toEqual(original)
    })

    it.each(required)('requires %s before submission', (field) => {
      const result = validate({ ...form, [field]: '' })
      expect(result.payload).toBeNull()
      expect(result.errors[field as string]).toBeTruthy()
    })

    it.each(optional)('permits an empty optional %s', (field) => {
      const result = validate({ ...form, [field]: '' })
      expect(result.errors).toEqual({})
      expect(result.payload).not.toBeNull()
    })
  })
}
