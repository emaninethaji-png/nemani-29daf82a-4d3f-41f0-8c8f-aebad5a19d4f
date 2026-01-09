import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import type { Reflector } from "@nestjs/core"
import { hasPermission } from "@task-mgmt/auth"
import { PERMISSION_KEY } from "../decorators/require-permission.decorator"

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissionRequirement = this.reflector.get(PERMISSION_KEY, context.getHandler())
    if (!permissionRequirement) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException("User not authenticated")
    }

    const hasAccess = hasPermission(user.role, permissionRequirement.resource, permissionRequirement.action)

    if (!hasAccess) {
      throw new ForbiddenException(
        `Insufficient permissions: ${permissionRequirement.action} on ${permissionRequirement.resource}`,
      )
    }

    return true
  }
}
