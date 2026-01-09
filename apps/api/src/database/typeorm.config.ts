import type { DataSourceOptions } from "typeorm"
import { User } from "../entities/user.entity"
import { Organization } from "../entities/organization.entity"
import { Task } from "../entities/task.entity"
import { AuditLog } from "../entities/audit-log.entity"

export const typeormConfig: DataSourceOptions = {
  type: "sqlite",
  database: process.env.DATABASE_PATH || "./data/app.db",
  entities: [User, Organization, Task, AuditLog],
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
}
