import {
  AcademicCapIcon,
  ArchiveBoxIcon,
  ArrowsRightLeftIcon,
  BellIcon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  Cog6ToothIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  MapIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import type { Component } from 'vue'
import type { IconName } from '~/types/domain/misc'

export const HERO_ICON_MAP: Record<IconName, Component> = {
  'home': HomeIcon,
  'users': UsersIcon,
  'building': BuildingOffice2Icon,
  'clipboard': ClipboardDocumentCheckIcon,
  'academic-cap': AcademicCapIcon,
  'map': MapIcon,
  'shield': ShieldCheckIcon,
  'squares': Squares2X2Icon,
  'cube': CubeIcon,
  'archive': ArchiveBoxIcon,
  'arrow-path': ArrowsRightLeftIcon,
  'exclamation': ExclamationTriangleIcon,
  'clock': ClockIcon,
  'cog': Cog6ToothIcon,
  'bell': BellIcon
}

