import { ROUTE_PATHS } from '~/constants/routes.constants'
import type { NavigationItem, NavigationSection } from '~/types/domain/misc'

export const SIDEBAR_NAVIGATION_SECTIONS: readonly NavigationSection[] = Object.freeze([
  {
    title: 'Personnel Monitoring',
    items: [
      { label: 'Dashboard', to: ROUTE_PATHS.home, icon: 'home' },
      { label: 'Personnel', to: ROUTE_PATHS.personnel, icon: 'users' },
      { label: 'Battalions & Companies', to: ROUTE_PATHS.battalions, icon: 'building' },
      { label: 'Service & Employment Status', to: ROUTE_PATHS.serviceStatuses, icon: 'clipboard' }
    ]
  },
  {
    title: 'Operational Records',
    items: [
      { label: 'Training Records', to: ROUTE_PATHS.trainingRecords, icon: 'academic-cap' },
      { label: 'Deployment Records', to: ROUTE_PATHS.deploymentRecords, icon: 'map' },
      { label: 'Engagement Records', to: ROUTE_PATHS.engagementRecords, icon: 'shield' }
    ]
  },
  {
    title: 'Equipment Handling',
    items: [
      { label: 'Equipment Categories', to: ROUTE_PATHS.equipmentCategories, icon: 'squares' },
      { label: 'Equipment Items', to: ROUTE_PATHS.equipmentItems, icon: 'cube' },
      { label: 'Equipment Assets', to: ROUTE_PATHS.equipmentAssets, icon: 'archive' },
      { label: 'Equipment Issuances', to: ROUTE_PATHS.equipmentIssuances, icon: 'arrow-path' }
    ]
  },
  {
    title: 'Incidents & Audits',
    items: [
      { label: 'Incident Tracking', to: ROUTE_PATHS.incidents, icon: 'exclamation' },
      { label: 'Audit Trail', to: ROUTE_PATHS.auditTrail, icon: 'clock' }
    ]
  }
])

export const SIDEBAR_FOOTER_ITEMS: readonly NavigationItem[] = Object.freeze([
  {
    label: 'Settings',
    to: ROUTE_PATHS.settings,
    icon: 'cog'
  }
])

export const DASHBOARD_SEARCH_PLACEHOLDER = 'Search personnel, equipment, deployments...'
