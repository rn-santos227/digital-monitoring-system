export type ProfileSettingsTabId = 'details' | 'email' | 'password' | 'other'

export interface ProfileDetailsPayload {
  fullName: string
}

export interface ProfileEmailPayload {
  email: string
}

export interface ProfileOtherDetailsPayload {
  avatarUrl: string | null
}

export interface ProfilePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface ProfileSettingsState {
  isOpen: boolean
  activeTab: ProfileSettingsTabId
  isSubmitting: boolean
  error: string
  warning: string
}
