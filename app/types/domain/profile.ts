export type ProfileSettingsTabId = 'details' | 'email' | 'password' | 'other'

export interface ProfileDetailsPayload {
  fullName: string
}

export interface ProfileEmailPayload {
  email: string
}
