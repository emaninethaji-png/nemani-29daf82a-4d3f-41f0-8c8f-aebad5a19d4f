import { Test, type TestingModule } from "@nestjs/testing"
import { TaskController } from "./task.controller"
import type { TaskService } from "./task.service"
import type { JwtPayload } from "@task-mgmt/data"
import { TaskStatus } from "@task-mgmt/data"
import { jest } from "@jest/globals"

describe("TaskController", () => {
  let controller: TaskController
  let service: TaskService

  const mockUser: JwtPayload = {
    sub: "user-id",
    email: "test@example.com",
    organizationId: "org-id",
    role: "owner",
    iat: Date.now(),
    exp: Date.now() + 3600000,
  }

  const mockTask = {
    id: "task-id",
    title: "Test Task",
    description: "Test description",
    status: TaskStatus.TODO,
    category: "Work",
    organizationId: "org-id",
    createdById: "user-id",
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: "TaskService",
          useValue: {
            create: jest.fn().mockResolvedValue(mockTask),
            findAll: jest.fn().mockResolvedValue([mockTask]),
            findOne: jest.fn().mockResolvedValue(mockTask),
            update: jest.fn().mockResolvedValue({ ...mockTask, title: "Updated" }),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    controller = module.get<TaskController>(TaskController)
    service = module.get<TaskService>("TaskService")
  })

  describe("create", () => {
    it("should create a task", async () => {
      const createDto = {
        title: "New Task",
        description: "New description",
        category: "Work",
      }

      const result = await controller.create(createDto, mockUser)

      expect(result).toEqual(mockTask)
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser)
    })
  })

  describe("findAll", () => {
    it("should return all tasks for user organization", async () => {
      const result = await controller.findAll(mockUser)

      expect(Array.isArray(result)).toBe(true)
      expect(service.findAll).toHaveBeenCalledWith(mockUser)
    })
  })

  describe("findOne", () => {
    it("should return a specific task", async () => {
      const result = await controller.findOne("task-id", mockUser)

      expect(result).toEqual(mockTask)
      expect(service.findOne).toHaveBeenCalledWith("task-id", mockUser)
    })
  })

  describe("update", () => {
    it("should update a task", async () => {
      const updateDto = { title: "Updated" }
      const result = await controller.update("task-id", updateDto, mockUser)

      expect(result.title).toBe("Updated")
      expect(service.update).toHaveBeenCalledWith("task-id", updateDto, mockUser)
    })
  })

  describe("delete", () => {
    it("should delete a task", async () => {
      await controller.delete("task-id", mockUser)

      expect(service.delete).toHaveBeenCalledWith("task-id", mockUser)
    })
  })
})
