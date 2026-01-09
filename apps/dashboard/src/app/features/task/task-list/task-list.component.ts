import { Component, type OnInit } from "@angular/core"
import type { TaskService } from "../task.service"
import type { TaskDto } from "@task-mgmt/data"
import { TaskStatus } from "@task-mgmt/data"
import { type CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop"

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.component.html",
  styleUrls: ["./task-list.component.css"],
})
export class TaskListComponent implements OnInit {
  tasks: TaskDto[] = []
  filteredTasks: TaskDto[] = []
  loading = false
  error = ""
  selectedCategory = "All"
  categories: string[] = ["All"]
  TaskStatus = TaskStatus

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks()
  }

  loadTasks(): void {
    this.loading = true
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks
        this.extractCategories()
        this.filterTasks()
        this.loading = false
      },
      error: (error) => {
        this.error = "Failed to load tasks"
        this.loading = false
      },
    })
  }

  deleteTask(id: string): void {
    if (confirm("Are you sure?")) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((t) => t.id !== id)
          this.filterTasks()
        },
        error: () => {
          this.error = "Failed to delete task"
        },
      })
    }
  }

  updateTaskStatus(task: TaskDto, newStatus: TaskStatus): void {
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: (updated) => {
        const index = this.tasks.findIndex((t) => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = updated
          this.filterTasks()
        }
      },
      error: () => {
        this.error = "Failed to update task"
      },
    })
  }

  drop(event: CdkDragDrop<TaskDto[]>): void {
    const reordered = [...this.filteredTasks]
    moveItemInArray(reordered, event.previousIndex, event.currentIndex)

    const updates = reordered.map((task, index) => ({
      id: task.id,
      order: index,
    }))

    this.taskService.reorderTasks(updates).subscribe({
      error: () => {
        this.error = "Failed to reorder tasks"
      },
    })
  }

  private extractCategories(): void {
    const cats = new Set(this.tasks.map((t) => t.category))
    this.categories = ["All", ...Array.from(cats)]
  }

  private filterTasks(): void {
    if (this.selectedCategory === "All") {
      this.filteredTasks = this.tasks
    } else {
      this.filteredTasks = this.tasks.filter((t) => t.category === this.selectedCategory)
    }
  }
}
