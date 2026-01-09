import { Injectable, ConflictException } from "@nestjs/common"
import type { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import type { RegisterDto, UserDto } from "@task-mgmt/data"
import type { User } from "../entities/user.entity"
import type { Organization } from "../entities/organization.entity"

@Injectable()
export class UserService {
  constructor(userRepository: Repository<User>, organizationRepository: Repository<Organization>) {
    this.userRepository = userRepository
    this.organizationRepository = organizationRepository
  }

  private userRepository: Repository<User>
  private organizationRepository: Repository<Organization>

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } })
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const existingUser = await this.findByEmail(registerDto.email)
    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    // Create organization
    const organization = this.organizationRepository.create({
      name: registerDto.organizationName,
      ownerId: "", // Will be set after user creation
    })

    // Create user
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: "owner",
    })

    // Set user in organization and save both
    organization.ownerId = user.id
    const savedOrganization = await this.organizationRepository.save(organization)
    user.organizationId = savedOrganization.id
    const savedUser = await this.userRepository.save(user)

    const { password, ...userDto } = savedUser
    return userDto as UserDto
  }
}
