import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { AuditLog } from "../entities/audit-log.entity"

@Injectable()
export class AuditLogService {
  private auditLogRepository: Repository<AuditLog>

  constructor(auditLogRepository: Repository<AuditLog>) {
    this.auditLogRepository = auditLogRepository
  }

  async log(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    result: "success" | "failure",
    details?: string,
  ): Promise<AuditLog> {
    const log = this.auditLogRepository.create({
      userId,
      action,
      resource,
      resourceId,
      result,
      details,
    })
    return this.auditLogRepository.save(log)
  }

  async findByOrganization(organizationId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { user: { organizationId } },
      relations: ["user"],
      order: { timestamp: "DESC" },
    })
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      relations: ["user"],
      order: { timestamp: "DESC" },
    })
  }
}
