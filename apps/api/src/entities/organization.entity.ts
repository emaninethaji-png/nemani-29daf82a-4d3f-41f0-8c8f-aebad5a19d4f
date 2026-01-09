import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { User } from "./user.entity"
import { Task } from "./task.entity"

@Entity("organizations")
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  ownerId: string

  @Column({ nullable: true })
  parentId?: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date

  @OneToMany(
    () => User,
    (user) => user.organization,
  )
  users: User[]

  @OneToMany(
    () => Task,
    (task) => task.organization,
  )
  tasks: Task[]

  @ManyToOne(() => Organization, { nullable: true })
  parent?: Organization

  @OneToMany(
    () => Organization,
    (org) => org.parent,
  )
  children: Organization[]
}
