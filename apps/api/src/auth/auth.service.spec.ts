import { Test, type TestingModule } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { UnauthorizedException } from "@nestjs/common"
import { AuthService } from "./auth.service"
import type { UserService } from "../user/user.service"
import * as bcrypt from "bcrypt"
import { jest } from "@jest/globals"

describe("AuthService", () => {
  let service: AuthService
  let jwtService: JwtService
  let userService: UserService

  const mockUser = {
    id: "test-id",
    email: "test@example.com",
    password: bcrypt.hashSync("password123", 10),
    firstName: "Test",
    lastName: "User",
    organizationId: "org-id",
    role: "viewer",
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("mock-token"),
          },
        },
        {
          provide: "UserService",
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
    userService = module.get<UserService>("UserService")
  })

  describe("login", () => {
    it("should return access token on successful login", async () => {
      jest.spyOn(userService, "findByEmail").mockResolvedValue(mockUser as any)
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as any)

      const result = await service.login({ email: "test@example.com", password: "password123" })

      expect(result).toHaveProperty("accessToken")
      expect(result.accessToken).toBe("mock-token")
    })

    it("should throw on invalid email", async () => {
      jest.spyOn(userService, "findByEmail").mockResolvedValue(null)

      await expect(service.login({ email: "nonexistent@example.com", password: "password" })).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it("should throw on invalid password", async () => {
      jest.spyOn(userService, "findByEmail").mockResolvedValue(mockUser as any)
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as any)

      await expect(service.login({ email: "test@example.com", password: "wrong-password" })).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })
})
