import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./user.entity"

@Entity("audit_logs")
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  userId: string

  @Column()
  action: string

  @Column()
  resource: string

  @Column()
  resourceId: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp: Date

  @Column()
  result: "success" | "failure"

  @Column({ nullable: true })
  details?: string

  @ManyToOne(
    () => User,
    (user) => user.auditLogs,
  )
  user: User
}
