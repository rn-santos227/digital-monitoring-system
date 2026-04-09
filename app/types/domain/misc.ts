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
  | 'academic-cap'
  | 'map'
  | 'shield'
  | 'squares'
  | 'cube'
  | 'archive'
  | 'arrow-path'
  | 'exclamation'
  | 'clock'
  | 'cog'
  | 'bell'

export type NavigationItem = {
  label: string
  to: string
  icon: IconName
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
