import { createError } from 'h3'
import { PERSONNEL_RELATIONSHIP_REFERENCE_DEFINITIONS } from '../constants'
import type { PersonnelRelationshipCount } from '../models'
import type { PersonnelRelationshipCountsResponse } from '../responses'

interface ReferenceCountSupabaseClient {
  from: (table: string) => {
    select: (
      columns: string,
      options: { count: 'exact'; head: true },
    ) => {
      eq: (column: string, value: string) => Promise<{ count: number | null; error: { message: string } | null }>
    }
  }
}

export const getPersonnelReferenceCount = async (args: {
  supabase: unknown
  table: string
  column: string
  id: string
}): Promise<number> => {
  const supabaseClient = args.supabase as ReferenceCountSupabaseClient

  const { count, error } = await supabaseClient
    .from(args.table)
    .select('id', { count: 'exact', head: true })
    .eq(args.column, args.id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to check ${args.table} references: ${error.message}` })
  }

  return count ?? 0
}

export const getPersonnelRelationshipCounts = async (args: {
  supabase: unknown
  personnelId: string
}): Promise<PersonnelRelationshipCount[]> => {
  const relationships = await Promise.all(PERSONNEL_RELATIONSHIP_REFERENCE_DEFINITIONS.map(async relationship => {
    const count = await getPersonnelReferenceCount({
      supabase: args.supabase,
      table: relationship.table,
      column: relationship.column,
      id: args.personnelId,
    })

    return {
      key: relationship.key,
      table: relationship.table,
      column: relationship.column,
      domain: relationship.domain,
      relationship: relationship.relationship,
      count,
    }
  }))

  return relationships
}

export const mapPersonnelRelationshipCountsResponse = (
  relationships: PersonnelRelationshipCount[],
): PersonnelRelationshipCountsResponse => {
  const relationshipCountMap = new Map(relationships.map(relationship => [relationship.key, relationship.count]))

  const trainingRecords = relationshipCountMap.get('trainingRecords') ?? 0
  const deploymentRecords = relationshipCountMap.get('deploymentRecords') ?? 0
  const deploymentSupervisions = relationshipCountMap.get('deploymentSupervisions') ?? 0
  const engagementRecords = relationshipCountMap.get('engagementRecords') ?? 0
  const assignedEquipmentAssets = relationshipCountMap.get('assignedEquipmentAssets') ?? 0
  const equipmentIssuancesReceived = relationshipCountMap.get('equipmentIssuancesReceived') ?? 0
  const equipmentIssuancesIssued = relationshipCountMap.get('equipmentIssuancesIssued') ?? 0
  const qualificationRecords = relationshipCountMap.get('qualificationRecords') ?? 0
  const medicalReadinessRecords = relationshipCountMap.get('medicalReadinessRecords') ?? 0
  const weaponAssignments = relationshipCountMap.get('weaponAssignments') ?? 0

  const totalReferences = relationships.reduce((total, relationship) => total + relationship.count, 0)

  return {
    breakdown: relationships.map(relationship => ({
      key: relationship.key,
      table: relationship.table,
      column: relationship.column,
      domain: relationship.domain,
      relationship: relationship.relationship,
      count: relationship.count,
      isReferenced: relationship.count > 0,
    })),
    trainingRecords,
    deploymentRecords,
    deploymentSupervisions,
    engagementRecords,
    assignedEquipmentAssets,
    equipmentIssuancesReceived,
    equipmentIssuancesIssued,
    qualificationRecords,
    medicalReadinessRecords,
    weaponAssignments,
    totalReferences,
    hasReferences: totalReferences > 0,
  }
}
