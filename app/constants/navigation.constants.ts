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
])

export const DASHBOARD_SEARCH_PLACEHOLDER = 'Search personnel, equipment, deployments...'
