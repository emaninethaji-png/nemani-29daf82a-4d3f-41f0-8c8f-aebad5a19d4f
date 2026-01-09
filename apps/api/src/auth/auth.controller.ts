import { Controller, Post, HttpCode, HttpStatus } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import type { LoginDto, AuthTokens } from "@task-mgmt/data"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(loginDto: LoginDto): Promise<AuthTokens> {
    return this.authService.login(loginDto)
  }
}
