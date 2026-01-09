import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { DragDropModule } from "@angular/cdk/drag-drop"
import { TaskRoutingModule } from "./task-routing.module"
import { TaskListComponent } from "./task-list/task-list.component"

@NgModule({
  declarations: [TaskListComponent],
  imports: [CommonModule, FormsModule, DragDropModule, TaskRoutingModule],
})
export class TaskModule {}
