import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { TaskStatus } from "@task-mgmt/data"
import { User } from "./user.entity"
import { Organization } from "./organization.entity"

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus

  @Column()
  category: string

  @Column()
  organizationId: string

  @Column()
  createdById: string

  @Column({ nullable: true })
  assignedToId?: string

  @Column({ type: "timestamp", nullable: true })
  dueDate?: Date

  @Column({ default: 0 })
  order: number

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date

  @ManyToOne(
    () => User,
    (user) => user.tasksCreated,
  )
  createdBy: User

  @ManyToOne(
    () => User,
    (user) => user.tasksAssigned,
    { nullable: true },
  )
  assignedTo?: User

  @ManyToOne(
    () => Organization,
    (org) => org.tasks,
  )
  organization: Organization
}
