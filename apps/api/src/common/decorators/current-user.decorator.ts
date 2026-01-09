import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import type { JwtPayload } from "@task-mgmt/data"

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
