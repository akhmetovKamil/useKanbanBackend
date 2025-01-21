import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { ParseObjectIdPipe } from "../../common/pipes/parse_object_id.pipe";
import { Types } from "mongoose";
import { CreateTaskDto } from "./dto/create.task.dto";
import { ColumnEnum } from "./tasks.type";

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post("/:boardId")
    @HttpCode(HttpStatus.CREATED)
    async createTask(
        @Param("boardId", ParseObjectIdPipe) boardId: Types.ObjectId,
        @Body() dto: CreateTaskDto,
    ) {
        return this.tasksService.createTask(boardId, dto);
    }

    @Get("board/:boardId")
    async getTasksByBoard(@Param("boardId", ParseObjectIdPipe) boardId: Types.ObjectId,) {
        return this.tasksService.getTasksByBoard(boardId);
    }

    @Get("column/:boardId")
    async getBoards(
        @Param("boardId", ParseObjectIdPipe) boardId: Types.ObjectId,
        @Query() column: ColumnEnum,
    ) {
        return this.tasksService.getTaskByColumn(boardId, column);
    }
    
    @Get(":taskId")
    async getTask(
        @Param("taskId", ParseObjectIdPipe) taskId: Types.ObjectId,
    ) {
        return this.tasksService.getTask(taskId);
    }

    @Delete(":boardId/:taskId")
    async deleteTask(
        @Param("boardId", ParseObjectIdPipe) boardId: Types.ObjectId,
        @Param("taskId", ParseObjectIdPipe) taskId: Types.ObjectId,
    ) {
        return this.tasksService.deleteTask(boardId,taskId);
    }

    @Put("/drag/:boardId/:taskId")
    async dragTask(
        @Param("boardId", ParseObjectIdPipe) boardId: Types.ObjectId,
        @Param("taskId", ParseObjectIdPipe) taskId: Types.ObjectId,
        @Query() column: ColumnEnum,
    ) {
        return this.tasksService.changeTaskStatus(boardId, taskId, column);
    }

    @Put(":taskId")
    async updateTaskInfo(
        @Param("taskId", ParseObjectIdPipe) taskId: Types.ObjectId,
        @Body() dto: CreateTaskDto,
    ) {
        return this.tasksService.updateTaskInfo(taskId, dto);
    }
}
