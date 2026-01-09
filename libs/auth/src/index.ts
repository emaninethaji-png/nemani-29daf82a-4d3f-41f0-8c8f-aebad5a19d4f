// RBAC and Authorization Logic

export enum PermissionAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  VIEW_AUDIT = "view_audit",
}

export enum PermissionResource {
  TASK = "task",
  USER = "user",
  ORGANIZATION = "organization",
}

export interface Permission {
  resource: PermissionResource
  action: PermissionAction
  scope: "own" | "organization" | "all"
}

// Role-based permissions matrix
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: [
    { resource: PermissionResource.TASK, action: PermissionAction.CREATE, scope: "organization" },
    { resource: PermissionResource.TASK, action: PermissionAction.READ, scope: "organization" },
    { resource: PermissionResource.TASK, action: PermissionAction.UPDATE, scope: "organization" },
    { resource: PermissionResource.TASK, action: PermissionAction.DELETE, scope: "organization" },
    { resource: PermissionResource.USER, action: PermissionAction.READ, scope: "organization" },
    { resource: PermissionResource.USER, action: PermissionAction.UPDATE, scope: "organization" },
    { resource: PermissionResource.USER, action: PermissionAction.CREATE, scope: "organization" },
    { resource: PermissionResource.ORGANIZATION, action: PermissionAction.UPDATE, scope: "own" },
    { resource: PermissionResource.TASK, action: PermissionAction.VIEW_AUDIT, scope: "organization" },
  ],
  admin: [
    { resource: PermissionResource.TASK, action: PermissionAction.CREATE, scope: "organization" },
    { resource: PermissionResource.TASK, action: PermissionAction.READ, scope: "organization" },
    { resource: PermissionResource.TASK, action: PermissionAction.UPDATE, scope: "organization" },
    { resource: PermissionResource.TASK, action: PermissionAction.DELETE, scope: "organization" },
    { resource: PermissionResource.USER, action: PermissionAction.READ, scope: "organization" },
    { resource: PermissionResource.TASK, action: PermissionAction.VIEW_AUDIT, scope: "organization" },
  ],
  viewer: [{ resource: PermissionResource.TASK, action: PermissionAction.READ, scope: "organization" }],
}

export function hasPermission(
  userRole: string,
  resource: PermissionResource,
  action: PermissionAction,
  scope?: "own" | "organization" | "all",
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole.toLowerCase()] || []
  return permissions.some(
    (p) => p.resource === resource && p.action === action && (!scope || p.scope === scope || p.scope === "all"),
  )
}

export interface JwtPayload {
  sub: string
  email: string
  organizationId: string
  role: string
  iat: number
  exp: number
}
