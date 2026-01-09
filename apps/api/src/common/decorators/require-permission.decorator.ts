import { SetMetadata } from "@nestjs/common"
import type { PermissionAction, PermissionResource } from "@task-mgmt/auth"

export interface PermissionRequirement {
  resource: PermissionResource
  action: PermissionAction
  scope?: "own" | "organization" | "all"
}

export const PERMISSION_KEY = "permission"
export const RequirePermission = (requirement: PermissionRequirement) => SetMetadata(PERMISSION_KEY, requirement)
