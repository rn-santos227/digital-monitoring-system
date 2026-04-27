# API Documentation

This document summarizes all API handlers currently under `server/api`.

## Conventions

- Base path is assumed to be `/api` (for example, `GET /api/users`).
- Dynamic route segments are shown as `:id`.
- `Request` lists path params, query params, and/or body contract when applicable.
- `Response` lists the primary success payload contract returned by the handler.

## Auth

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Body: `LoginBody` (`email`, `password`) | `{ ok: true, sessionToken, user, expiresAt }` |
| POST | `/api/auth/logout` | No body | `{ ok: true }` |
| GET | `/api/auth/session` | Session cookie/token required | `{ ok: true, user }` |

## Account Types

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/account-types` | Query: pagination (`page`, `pageSize`) | `AccountTypeListResponse` |
| GET | `/api/account-types/search` | Query: pagination (`page`, `pageSize`) and optional `search` | `AccountTypeListResponse` |
| GET | `/api/account-types/:id` | Path: `id` | `AccountTypeDetailResponse` |
| POST | `/api/account-types` | Body: `CreateAccountTypeRequest` | `{ ok: true, id }` |
| PATCH | `/api/account-types/:id` | Path: `id`; Body: `UpdateAccountTypeRequest` | `{ ok: true }` |
| DELETE | `/api/account-types/:id` | Path: `id` | `{ ok: true }` |

## Privileges

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/privileges` | Query: optional `accountTypeId` | `PrivilegeListResponse` |

## Users

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/users` | Query: pagination (`page`, `pageSize`), optional `search`, optional `isActive` | `UserProfileListCompactResponse` |
| GET | `/api/users/search` | Query: pagination (`page`, `pageSize`), optional `search`, optional `isActive` | `UserProfileListCompactResponse` |
| GET | `/api/users/:id` | Path: `id` | `UserProfileDetailResponse` |
| POST | `/api/users` | Body: `CreateUserProfileRequest` | `{ ok: true, id }` |
| PATCH | `/api/users/:id` | Path: `id`; Body: `UpdateUserProfileRequest` | `MutationSuccessResponse` |
| PATCH | `/api/users/:id/password` | Path: `id`; Body: `UpdateUserPasswordRequest` | `MutationSuccessResponse` |
| PATCH | `/api/users/:id/activation` | Path: `id`; Body: `UpdateUserActivationRequest` | `MutationSuccessResponse` |
| GET | `/api/users/:id/audit-logs` | Path: `id`; Query: pagination (`page`, `pageSize`) | `AuditLogListResponse` |

## Battalions

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/battalions` | Query: pagination (`page`, `pageSize`), optional `search`, optional `includeInactive` | `BattalionListResponse` |
| GET | `/api/battalions/search` | Query: pagination (`page`, `pageSize`), optional `term`, optional `isActive`, optional `fields` | `BattalionListResponse` |
| GET | `/api/battalions/suggestions` | Query: `term`, optional `pageSize`, optional `selectedId` | `BattalionSuggestionsResponse` |
| GET | `/api/battalions/:id` | Path: `id` | `BattalionDetailResponse` |
| GET | `/api/battalions/:id/companies` | Path: `id`; Query: pagination (`page`, `pageSize`), optional `search`, optional `includeInactive` | `BattalionCompanyListResponse` |
| GET | `/api/battalions/:id/personnel` | Path: `id`; Query: pagination (`page`, `pageSize`), optional `search` | `BattalionPersonnelListResponse` |
| GET | `/api/battalions/:id/equipment` | Path: `id`; Query: pagination (`page`, `pageSize`), optional `search` | `BattalionEquipmentAssetListResponse` |
| POST | `/api/battalions` | Body: `CreateBattalionRequest` | `{ ok: true, id }` |
| PATCH | `/api/battalions/:id` | Path: `id`; Body: `UpdateBattalionRequest` | `MutationSuccessResponse` |
| DELETE | `/api/battalions/:id` | Path: `id` | `MutationSuccessResponse` |

`BattalionDetailResponse` includes summary counters: `companyCount`, `personnelCount`, and `equipmentAssetCount`.

## Companies

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/companies` | Query: pagination (`page`, `pageSize`), optional `search`, optional `includeInactive`, optional `battalionId` | `CompanyListResponse` |
| GET | `/api/companies/search` | Query: pagination (`page`, `pageSize`) and optional `search` | `CompanyListResponse` |
| GET | `/api/companies/suggestions` | Query: `term`, optional `pageSize`, optional `selectedId`, optional `battalionId` | `CompanySuggestionsResponse` |
| GET | `/api/companies/:id` | Path: `id` | `CompanyDetailResponse` |
| GET | `/api/companies/:id/personnel` | Path: `id`; Query: pagination (`page`, `pageSize`), optional `search` | `CompanyPersonnelListResponse` |
| GET | `/api/companies/:id/equipment` | Path: `id`; Query: pagination (`page`, `pageSize`), optional `search` | `CompanyEquipmentAssetListResponse` |
| GET | `/api/companies/personnel` | Query: pagination (`page`, `pageSize`), optional `search`, optional `companyId`, optional `battalionId` | `CompanyPersonnelListResponse` |
| POST | `/api/companies` | Body: `CreateCompanyRequest` | `{ ok: true, id }` |
| PATCH | `/api/companies/:id` | Path: `id`; Body: `UpdateCompanyRequest` | `MutationSuccessResponse` |
| DELETE | `/api/companies/:id` | Path: `id` | `MutationSuccessResponse` |

`CompanyDetailResponse` includes summary counters: `personnelCount` and `equipmentAssetCount`.

## Personnel

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/personnel` | Query: pagination (`page`, `pageSize`) | `PersonnelListResponse` |
| GET | `/api/personnel/search` | Query: pagination (`page`, `pageSize`) and optional `search` | `PersonnelListCompactResponse` |
| GET | `/api/personnel/suggestions` | Query: `term`, optional `pageSize`, optional `selectedPersonnelId` | `PersonnelSuggestionsResponse` |
| GET | `/api/personnel/:id` | Path: `id` | `PersonnelDetailResponse` |
| POST | `/api/personnel` | Body: `CreatePersonnelRequest` | `{ ok: true, id }` |
| PATCH | `/api/personnel/:id` | Path: `id`; Body: `UpdatePersonnelRequest` | `MutationSuccessResponse` |
| DELETE | `/api/personnel/:id` | Path: `id` | `MutationSuccessResponse` |
| GET | `/api/personnel/:id/training-records` | Path: `id`; Query: pagination (`page`, `pageSize`) | `PersonnelTrainingRecordListResponse` |
| GET | `/api/personnel/:id/deployment-records` | Path: `id`; Query: pagination (`page`, `pageSize`) | `PersonnelDeploymentRecordListResponse` |
| GET | `/api/personnel/:id/engagement-records` | Path: `id`; Query: pagination (`page`, `pageSize`) | `PersonnelEngagementRecordListResponse` |
| GET | `/api/personnel/:id/equipment-issuances` | Path: `id`; Query: pagination (`page`, `pageSize`) | `PersonnelEquipmentIssuanceListResponse` |

## Training

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/trainings` | Query: pagination (`page`, `pageSize`), optional `search` | `TrainingListResponse` |
| GET | `/api/trainings/search` | Query: pagination (`page`, `pageSize`), optional `term`, optional `fields` | `TrainingListResponse` |
| GET | `/api/trainings/suggestions` | Query: `term`, optional `pageSize`, optional `selectedId` | `TrainingSuggestionResponse` |
| GET | `/api/trainings/:id` | Path: `id` | `TrainingDetailResponse` |
| POST | `/api/trainings` | Body: `CreateTrainingRequest` | `{ ok: true, id }` |
| PATCH | `/api/trainings/:id` | Path: `id`; Body: `UpdateTrainingRequest` | `MutationSuccessResponse` |
| DELETE | `/api/trainings/:id` | Path: `id` | `MutationSuccessResponse` |
| GET | `/api/training-categories` | Query: pagination (`page`, `pageSize`), optional `search` | `TrainingCategoryListResponse` |
| GET | `/api/training-categories/search` | Query: pagination (`page`, `pageSize`), optional `term`, optional `fields` | `TrainingCategoryListResponse` |
| GET | `/api/training-categories/:id` | Path: `id` | `TrainingCategoryDetailResponse` |
| POST | `/api/training-categories` | Body: `CreateTrainingCategoryRequest` | `{ ok: true, id }` |
| PATCH | `/api/training-categories/:id` | Path: `id`; Body: `UpdateTrainingCategoryRequest` | `MutationSuccessResponse` |
| DELETE | `/api/training-categories/:id` | Path: `id` | `MutationSuccessResponse` |
| GET | `/api/training-records` | Query: pagination (`page`, `pageSize`), optional `search` | `TrainingRecordListResponse` |
| GET | `/api/training-records/search` | Query: pagination (`page`, `pageSize`), optional `term`, optional `fields`, optional `trainingId`, optional `personnelId`, optional `trainingCategoryId`, optional `statusId` | `TrainingRecordListResponse` |
| GET | `/api/training-records/:id` | Path: `id` | `TrainingRecordDetailResponse` |
| POST | `/api/training-records` | Body: `CreateTrainingRecordRequest` | `CreateTrainingRecordResponse` |
| PATCH | `/api/training-records/:id` | Path: `id`; Body: `UpdateTrainingRecordRequest` | `MutationSuccessResponse` |
| DELETE | `/api/training-records/:id` | Path: `id` | `MutationSuccessResponse` |

Training record endpoints require the `training.manage` privilege.

## Dashboard

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/dashboard/unit-management` | No request body; caller must have at least one unit/personnel view privilege | `{ totalCompanies, totalBattalions, totalUnassignedPersonnel }` |

## Files

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| POST | `/api/files/upload` | Multipart form-data (`file` part + optional MIME prefix constraints) | `FileUploadResponse` |

## Ranks

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/ranks` | Query: pagination (`page`, `pageSize`), optional `search` | `RankListApiResponse` |
| GET | `/api/ranks/suggestion` | Query: `term`, optional `pageSize`, optional `selectedId` | `RankSuggestionApiResponse` |
| POST | `/api/ranks` | Body: `CreateRankRequest` | `{ ok: true, id }` |
| DELETE | `/api/ranks/:id` | Path: `id` | `MutationSuccessResponse` |

## Audit Logs

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/audit/logs` | Query: pagination (`page`, `pageSize`) and optional filter params | `AuditLogListResponse` |
| GET | `/api/audit/search` | Query: pagination (`page`, `pageSize`) and optional `search` | `AuditLogListResponse` |
| GET | `/api/audit/logs/:id` | Path: `id` | `AuditLogDetail` |

## Shared request/response contracts

The request and response contracts referenced above are defined in:

- `server/shared/requests` (request bodies)
- `server/shared/responses` and `server/shared/models` (response payload interfaces)
