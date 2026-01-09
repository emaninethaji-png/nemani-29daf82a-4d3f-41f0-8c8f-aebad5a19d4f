import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { CreateTaskDto, UpdateTaskDto, JwtPayload } from "@task-mgmt/data"
import type { Task } from "../entities/task.entity"
import type { AuditLogService } from "../audit-log/audit-log.service"

@Injectable()
export class TaskService {
  constructor(
    private taskRepository: Repository<Task>,
    private auditLogService: AuditLogService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: JwtPayload): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      organizationId: user.organizationId,
      createdById: user.sub,
      order: await this.getMaxOrder(user.organizationId),
    })

    const savedTask = await this.taskRepository.save(task)
    await this.auditLogService.log(user.sub, "CREATE", "task", savedTask.id, "success")
    return savedTask
  }

  async findAll(user: JwtPayload): Promise<Task[]> {
    return this.taskRepository.find({
      where: { organizationId: user.organizationId },
      relations: ["createdBy", "assignedTo"],
      order: { order: "ASC", createdAt: "DESC" },
    })
  }

  async findOne(id: string, user: JwtPayload): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, organizationId: user.organizationId },
      relations: ["createdBy", "assignedTo"],
    })

    if (!task) {
      throw new NotFoundException("Task not found")
    }

    return task
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: JwtPayload): Promise<Task> {
    const task = await this.findOne(id, user)

    Object.assign(task, updateTaskDto)
    const updated = await this.taskRepository.save(task)
    await this.auditLogService.log(user.sub, "UPDATE", "task", id, "success")
    return updated
  }

  async delete(id: string, user: JwtPayload): Promise<void> {
    const task = await this.findOne(id, user)
    await this.taskRepository.delete(task.id)
    await this.auditLogService.log(user.sub, "DELETE", "task", id, "success")
  }

  async reorder(tasks: Array<{ id: string; order: number }>, user: JwtPayload): Promise<void> {
    for (const taskUpdate of tasks) {
      const task = await this.findOne(taskUpdate.id, user)
      task.order = taskUpdate.order
      await this.taskRepository.save(task)
    }
  }

  private async getMaxOrder(organizationId: string): Promise<number> {
    const result = await this.taskRepository
      .createQueryBuilder()
      .select("MAX(order)", "maxOrder")
      .where("organizationId = :organizationId", { organizationId })
      .getRawOne()

    return (result?.maxOrder ?? -1) + 1
  }
}
