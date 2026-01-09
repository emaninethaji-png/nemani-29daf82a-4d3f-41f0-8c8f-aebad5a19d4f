import { Controller, Get, UseGuards, ForbiddenException } from "@nestjs/common"
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard"
import { PermissionGuard } from "../common/guards/permission.guard"
import { RequirePermission } from "../common/decorators/require-permission.decorator"
import type { AuditLogService } from "./audit-log.service"
import type { JwtPayload } from "@task-mgmt/data"
import { UserRole } from "@task-mgmt/data"
import { PermissionAction, PermissionResource } from "@task-mgmt/auth"
import type { AuditLog } from "../entities/audit-log.entity"

@Controller("audit-log")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {}

  @Get()
  @RequirePermission({
    resource: PermissionResource.TASK,
    action: PermissionAction.VIEW_AUDIT,
  })
  async getAuditLog(user: JwtPayload): Promise<AuditLog[]> {
    if (user.role === UserRole.OWNER || user.role === UserRole.ADMIN) {
      return this.auditLogService.findByOrganization(user.organizationId)
    }
    throw new ForbiddenException("Only Owner and Admin can view audit logs")
  }
}
