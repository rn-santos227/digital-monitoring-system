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

export type NavigationItem = {
  label: string
  to: string
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
