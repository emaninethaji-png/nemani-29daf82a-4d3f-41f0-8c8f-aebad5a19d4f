import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import type { JwtPayload } from "@task-mgmt/data"

@Injectable()
export class OrgScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user: JwtPayload = request.user
    const { organizationId } = request.params

    if (!user) {
      throw new ForbiddenException("User not authenticated")
    }

    if (organizationId && organizationId !== user.organizationId) {
      throw new ForbiddenException("Cannot access resources from other organizations")
    }

    return true
  }
}
