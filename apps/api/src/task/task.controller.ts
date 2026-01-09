import { Controller, Get, Post, Put, Delete, Param, UseGuards, HttpCode, HttpStatus } from "@nestjs/common"
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard"
import { PermissionGuard } from "../common/guards/permission.guard"
import { OrgScopeGuard } from "../common/guards/org-scope.guard"
import { RequirePermission } from "../common/decorators/require-permission.decorator"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import type { TaskService } from "./task.service"
import type { CreateTaskDto, UpdateTaskDto, JwtPayload } from "@task-mgmt/data"
import { PermissionAction, PermissionResource } from "@task-mgmt/auth"
import type { Task } from "../entities/task.entity"

@Controller("tasks")
@UseGuards(JwtAuthGuard, PermissionGuard, OrgScopeGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @RequirePermission({
    resource: PermissionResource.TASK,
    action: PermissionAction.CREATE,
  })
  async create(createTaskDto: CreateTaskDto, @CurrentUser() user: JwtPayload): Promise<Task> {
    return this.taskService.create(createTaskDto, user)
  }

  @Get()
  @RequirePermission({
    resource: PermissionResource.TASK,
    action: PermissionAction.READ,
  })
  async findAll(@CurrentUser() user: JwtPayload): Promise<Task[]> {
    return this.taskService.findAll(user)
  }

  @Get(":id")
  @RequirePermission({
    resource: PermissionResource.TASK,
    action: PermissionAction.READ,
  })
  async findOne(@Param("id") id: string, @CurrentUser() user: JwtPayload): Promise<Task> {
    return this.taskService.findOne(id, user)
  }

  @Put(":id")
  @RequirePermission({
    resource: PermissionResource.TASK,
    action: PermissionAction.UPDATE,
  })
  async update(@Param("id") id: string, updateTaskDto: UpdateTaskDto, @CurrentUser() user: JwtPayload): Promise<Task> {
    return this.taskService.update(id, updateTaskDto, user)
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission({
    resource: PermissionResource.TASK,
    action: PermissionAction.DELETE,
  })
  async delete(@Param("id") id: string, @CurrentUser() user: JwtPayload): Promise<void> {
    return this.taskService.delete(id, user)
  }

  @Post("reorder")
  @HttpCode(HttpStatus.NO_CONTENT)
  async reorder(tasks: Array<{ id: string; order: number }>, @CurrentUser() user: JwtPayload): Promise<void> {
    return this.taskService.reorder(tasks, user)
  }
}
