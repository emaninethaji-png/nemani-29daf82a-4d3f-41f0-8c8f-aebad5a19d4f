import { hasPermission, ROLE_PERMISSIONS } from "./index"
import { PermissionAction, PermissionResource } from "./index"

describe("RBAC - Role Based Access Control", () => {
  describe("Permission Matrix", () => {
    it("should define permissions for owner role", () => {
      const ownerPermissions = ROLE_PERMISSIONS["owner"]
      expect(ownerPermissions).toBeDefined()
      expect(ownerPermissions.length).toBeGreaterThan(0)
    })

    it("should define permissions for admin role", () => {
      const adminPermissions = ROLE_PERMISSIONS["admin"]
      expect(adminPermissions).toBeDefined()
      expect(adminPermissions.length).toBeGreaterThan(0)
    })

    it("should define permissions for viewer role", () => {
      const viewerPermissions = ROLE_PERMISSIONS["viewer"]
      expect(viewerPermissions).toBeDefined()
    })

    it("admin should have fewer permissions than owner", () => {
      const ownerPerms = ROLE_PERMISSIONS["owner"].length
      const adminPerms = ROLE_PERMISSIONS["admin"].length
      expect(adminPerms).toBeLessThan(ownerPerms)
    })

    it("viewer should have fewer permissions than admin", () => {
      const adminPerms = ROLE_PERMISSIONS["admin"].length
      const viewerPerms = ROLE_PERMISSIONS["viewer"].length
      expect(viewerPerms).toBeLessThan(adminPerms)
    })
  })

  describe("hasPermission", () => {
    it("owner can create tasks", () => {
      const result = hasPermission("owner", PermissionResource.TASK, PermissionAction.CREATE)
      expect(result).toBe(true)
    })

    it("owner can delete tasks", () => {
      const result = hasPermission("owner", PermissionResource.TASK, PermissionAction.DELETE)
      expect(result).toBe(true)
    })

    it("admin can create tasks", () => {
      const result = hasPermission("admin", PermissionResource.TASK, PermissionAction.CREATE)
      expect(result).toBe(true)
    })

    it("admin cannot delete users", () => {
      const result = hasPermission("admin", PermissionResource.USER, PermissionAction.DELETE)
      expect(result).toBe(false)
    })

    it("viewer can only read tasks", () => {
      const canRead = hasPermission("viewer", PermissionResource.TASK, PermissionAction.READ)
      expect(canRead).toBe(true)

      const canCreate = hasPermission("viewer", PermissionResource.TASK, PermissionAction.CREATE)
      expect(canCreate).toBe(false)

      const canDelete = hasPermission("viewer", PermissionResource.TASK, PermissionAction.DELETE)
      expect(canDelete).toBe(false)
    })

    it("viewer cannot view audit logs", () => {
      const result = hasPermission("viewer", PermissionResource.TASK, PermissionAction.VIEW_AUDIT)
      expect(result).toBe(false)
    })

    it("owner can view audit logs", () => {
      const result = hasPermission("owner", PermissionResource.TASK, PermissionAction.VIEW_AUDIT)
      expect(result).toBe(true)
    })

    it("admin can view audit logs", () => {
      const result = hasPermission("admin", PermissionResource.TASK, PermissionAction.VIEW_AUDIT)
      expect(result).toBe(true)
    })

    it("should handle case-insensitive roles", () => {
      const result = hasPermission("OWNER", PermissionResource.TASK, PermissionAction.CREATE)
      expect(result).toBe(true)
    })
  })
})
