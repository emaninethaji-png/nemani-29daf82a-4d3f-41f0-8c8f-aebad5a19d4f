import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { TaskDto, CreateTaskDto, UpdateTaskDto } from "@task-mgmt/data"

@Injectable({ providedIn: "root" })
export class TaskService {
  private apiUrl = "http://localhost:3000/api/tasks"

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(this.apiUrl)
  }

  getTask(id: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.apiUrl}/${id}`)
  }

  createTask(task: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.apiUrl, task)
  }

  updateTask(id: string, task: UpdateTaskDto): Observable<TaskDto> {
    return this.http.put<TaskDto>(`${this.apiUrl}/${id}`, task)
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  reorderTasks(tasks: Array<{ id: string; order: number }>): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reorder`, tasks)
  }
}
