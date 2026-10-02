import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  REPORT_EQUIPMENT_ASSET_CHART_SELECT_COLUMNS,
  REPORT_PERSONNEL_CHART_SELECT_COLUMNS,
  REPORT_PERSONNEL_CHART_SOURCE,
} from '../../shared/constants'
import type { ReportChartsResponse } from '../../shared/responses'
import type { ReportDateRangeQuery } from '../../shared/requests'
import {
  buildReportMonthChart,
  buildReportStringChart,
  getReportEquipmentAssetStatusName,
  getReportEquipmentItemName,
  getReportEquipmentServiceabilityName,
  limitReportChartData,
  isReportDateInRange,
  type ReportEquipmentAssetChartRow,
  type ReportPersonnelChartRow,
} from '../../shared/utils'

const fetchTotalCount = async (
  supabase: SupabaseClient,
  tableName: string,
  contextLabel: string,
): Promise<number> => {
  const { count, error } = await supabase
    .from(tableName)
    .select('id', { count: 'exact', head: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load ${contextLabel}: ${error.message}` })
  }

  return count ?? 0
}

export const fetchReportCharts = async (
  supabase: SupabaseClient,
  dateRange: ReportDateRangeQuery = {},
): Promise<ReportChartsResponse> => {
  const [personnelResult, equipmentAssetsResult, equipmentItemsTotal] = await Promise.all([
    supabase
      .from(REPORT_PERSONNEL_CHART_SOURCE)
      .select(REPORT_PERSONNEL_CHART_SELECT_COLUMNS, { count: 'exact' }),
    supabase
      .from('equipment_assets')
      .select(REPORT_EQUIPMENT_ASSET_CHART_SELECT_COLUMNS, { count: 'exact' }),
    fetchTotalCount(supabase, 'equipment_items', 'report equipment item count'),
  ])

  if (personnelResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load report personnel charts: ${personnelResult.error.message}` })
  }

  if (equipmentAssetsResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load report equipment charts: ${equipmentAssetsResult.error.message}` })
  }

  const personnelRows = ((personnelResult.data ?? []) as ReportPersonnelChartRow[])
    .filter(row => isReportDateInRange(row.created_at, dateRange))
  const equipmentAssetRows = ((equipmentAssetsResult.data ?? []) as ReportEquipmentAssetChartRow[])
    .filter(row => isReportDateInRange(row.procurement_date ?? row.created_at, dateRange))
  const battalionNames = personnelRows.map(row => row.battalion_name?.trim()).filter((value): value is string => Boolean(value))
  const companyNames = personnelRows.map(row => row.company_name?.trim()).filter((value): value is string => Boolean(value))
  const locations = equipmentAssetRows.map(row => row.current_location?.trim()).filter((value): value is string => Boolean(value))

  return {
    asOf: new Date().toISOString(),
    personnel: {
      metrics: {
        totalRecords: personnelRows.length,
        battalionsRepresented: new Set(battalionNames).size,
        companiesRepresented: new Set(companyNames).size,
      },
      charts: {
        serviceStatus: buildReportStringChart(personnelRows, row => row.service_status),
        battalions: limitReportChartData(buildReportStringChart(personnelRows, row => row.battalion_name)),
        companies: limitReportChartData(buildReportStringChart(personnelRows, row => row.company_name)),
        sex: buildReportStringChart(personnelRows, row => row.sex),
        timeline: buildReportMonthChart(personnelRows, row => row.created_at),
      },
    },
    equipment: {
      metrics: {
        totalAssets: equipmentAssetsResult.count ?? equipmentAssetRows.length,
        totalItems: equipmentItemsTotal,
        trackedLocations: new Set(locations).size,
      },
      charts: {
        assetStatus: buildReportStringChart(equipmentAssetRows, getReportEquipmentAssetStatusName),
        serviceability: buildReportStringChart(equipmentAssetRows, getReportEquipmentServiceabilityName),
        items: limitReportChartData(buildReportStringChart(equipmentAssetRows, getReportEquipmentItemName)),
        locations: limitReportChartData(buildReportStringChart(equipmentAssetRows, row => row.current_location)),
        timeline: buildReportMonthChart(equipmentAssetRows, row => row.procurement_date ?? row.created_at),
      },
    },
  }
}
