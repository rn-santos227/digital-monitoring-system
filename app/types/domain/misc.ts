export interface SelectOption {
  label: string
  value: string
}

export interface RadioOption {
  label: string
  value: string
  helper?: string
}

export type BaseMenuItem = {
  label: string
  value: string
  danger?: boolean
}

export type IconName =
  | 'home'
  | 'users'
  | 'building'
  | 'clipboard'
  | 'clipboard-document-list'
  | 'academic-cap'
  | 'map'
  | 'map-pin'
  | 'shield'
  | 'shield-exclamation'
  | 'chart-bar'
  | 'squares'
  | 'table-cells'
  | 'cube'
  | 'archive'
  | 'arrow-path'
  | 'exclamation'
  | 'check-circle'
  | 'information-circle'
  | 'question-mark-circle'
  | 'x-circle'
  | 'x-mark'
  | 'clock'
  | 'cog'
  | 'bell'
  | 'eye'
  | 'pencil-square'
  | 'trash'
  | 'arrows-up-down'
  | 'magnifying-glass'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'user-plus'

export type NavigationItem = {
  label: string
  to: string
  icon: IconName
  requiredPermissions?: readonly string[]
  requiredPermissionMode?: 'all' | 'any'
}

export type NavigationSection = {
  title: string
  items: NavigationItem[]
}

export type DashboardMetric = {
  label: string
  value: string
  change: string
}

export interface KpiToneStyle {
  iconWrapper: string
  icon: string
  context: string
}

export interface LoginPageThemeStyle {
  brandPanel: string
  brandOverlay: string
  formPanel: string
  forgotLink: string
  badge: string
  description: string
  securityIcon: string
  securityText: string
  footerNotice: string
}
