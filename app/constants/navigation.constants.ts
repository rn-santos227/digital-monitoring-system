import { ROUTE_PATHS } from '~/constants/routes.constants'
import {
  ACCOUNT_TYPE_PRIVILEGES,
  AUDIT_PRIVILEGES,
  BATTALION_PRIVILEGES,
  COMPANY_PRIVILEGES,
  PERSONNEL_PRIVILEGES,
  TRAINING_PRIVILEGES,
  DEPLOYMENT_PRIVILEGES,
  ENGAGEMENT_PRIVILEGES,
  USER_PROFILE_PRIVILEGES,
  SETTINGS_PRIVILEGES,
} from '~/constants/privileges.constants'
import type { BaseMenuItem, NavigationItem, NavigationSection } from '~/types/domain/misc'

export const SIDEBAR_NAVIGATION_SECTIONS: readonly NavigationSection[] = Object.freeze([
  {
    title: 'Personnel Monitoring',
    items: [
      { label: 'Dashboard', to: ROUTE_PATHS.home, icon: 'home' },
      {
        label: 'Users Management',
        to: ROUTE_PATHS.users,
        icon: 'users',
        requiredPermissions: Object.freeze([...USER_PROFILE_PRIVILEGES.view, ...ACCOUNT_TYPE_PRIVILEGES.view]),
        requiredPermissionMode: 'any',
      },
      {
        label: 'Personnel',
        to: ROUTE_PATHS.personnel,
        icon: 'users',
        requiredPermissions: PERSONNEL_PRIVILEGES.view,
      },
      {
        label: 'Battalions & Companies',
        to: ROUTE_PATHS.units,
        icon: 'building',
        requiredPermissions: Object.freeze([...BATTALION_PRIVILEGES.view, ...COMPANY_PRIVILEGES.view]),
        requiredPermissionMode: 'any',
      },
      { label: 'Service & Employment Status', to: ROUTE_PATHS.serviceStatuses, icon: 'clipboard' }
    ]
  },
  {
    title: 'Operational Records',
    items: [
      {
        label: 'Training Records',
        to: ROUTE_PATHS.trainingRecords,
        icon: 'academic-cap',
        requiredPermissions: TRAINING_PRIVILEGES.manage,
      },
      {
        label: 'Deployment Records',
        to: ROUTE_PATHS.deploymentRecords,
        icon: 'map',
        requiredPermissions: DEPLOYMENT_PRIVILEGES.manage,
      },
      {
        label: 'Engagement Records',
        to: ROUTE_PATHS.engagementRecords,
        icon: 'shield',
        requiredPermissions: ENGAGEMENT_PRIVILEGES.manage,
      }
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
      {
        label: 'Audit Trail',
        to: ROUTE_PATHS.auditTrail,
        icon: 'clock',
        requiredPermissions: AUDIT_PRIVILEGES.view,
      }
    ]
  }
])

export const SIDEBAR_FOOTER_ITEMS: readonly NavigationItem[] = Object.freeze([
  {
    label: 'Settings',
    to: ROUTE_PATHS.settings,
    icon: 'cog',
    requiredPermissions: SETTINGS_PRIVILEGES.update,
  }
])

export const HEADER_ACCOUNT_MENU_ITEMS: readonly BaseMenuItem[] = Object.freeze([
  {
    label: 'My Account',
    value: 'my-account'
  },
  {
    label: 'Profile',
    value: 'profile'
  },
  {
    label: 'Settings',
    value: 'settings'
  },
  {
    label: 'Logout',
    value: 'logout',
    danger: true
  }
])

export const DASHBOARD_SEARCH_PLACEHOLDER = 'Search personnel, equipment, deployments...'
