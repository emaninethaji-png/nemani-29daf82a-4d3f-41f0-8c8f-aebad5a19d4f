import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserService } from "./user.service"
import { User } from "../entities/user.entity"
import { Organization } from "../entities/organization.entity"

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
