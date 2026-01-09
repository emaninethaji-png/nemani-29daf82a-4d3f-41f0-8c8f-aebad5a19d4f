import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { typeormConfig } from "./database/typeorm.config"
import { AuthModule } from "./auth/auth.module"
import { TaskModule } from "./task/task.module"
import { UserModule } from "./user/user.module"
import { AuditLogModule } from "./audit-log/audit-log.module"

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeormConfig),
    AuthModule,
    TaskModule,
    UserModule,
    AuditLogModule,
  ],
})
export class AppModule {}
