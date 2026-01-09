import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { UserRole } from "@task-mgmt/data"
import { Task } from "./task.entity"
import { Organization } from "./organization.entity"
import { AuditLog } from "./audit-log.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  organizationId: string

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role: UserRole

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date

  @ManyToOne(() => Organization)
  organization: Organization

  @OneToMany(
    () => Task,
    (task) => task.createdBy,
  )
  tasksCreated: Task[]

  @OneToMany(
    () => Task,
    (task) => task.assignedTo,
  )
  tasksAssigned: Task[]

  @OneToMany(
    () => AuditLog,
    (log) => log.user,
  )
  auditLogs: AuditLog[]
}
