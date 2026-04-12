import {
  AcademicCapIcon,
  ArchiveBoxIcon,
  ArrowsRightLeftIcon,
  BellIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  Cog6ToothIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  InformationCircleIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  XCircleIcon,
  XMarkIcon,
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
  'check-circle': CheckCircleIcon,
  'information-circle': InformationCircleIcon,
  'question-mark-circle': QuestionMarkCircleIcon,
  'x-circle': XCircleIcon,
  'x-mark': XMarkIcon,
  'clock': ClockIcon,
  'cog': Cog6ToothIcon,
  'bell': BellIcon
}

export const getHeroIcon = (name: IconName): Component => HERO_ICON_MAP[name]
