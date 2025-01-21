import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { TasksSchema } from "./tasks.schema";
import { Types } from "mongoose";
import { Errors } from "../../common/exception.constants";
import { CreateTaskDto } from "./dto/create.task.dto";
import { BoardsService } from "../boards.service";
import { ColumnEnum } from "./tasks.type";


@Injectable()
export class TasksService {
    constructor(
        @InjectModel(TasksSchema)
        private readonly tasksSchema: ReturnModelType<typeof TasksSchema>,
        private readonly boardsService: BoardsService,
    ) {}

    async createTask(boardId: Types.ObjectId, dto: CreateTaskDto): Promise<TasksSchema>{
        const task = new this.tasksSchema({...dto})
        await this.boardsService.addTask(boardId, task._id)
        return task.save()
    }

    async getTask(taskId: Types.ObjectId): Promise<TasksSchema>{
        const task = await this.tasksSchema.findById(taskId).exec();
        if (!task) throw new NotFoundException(Errors.TASK_NOT_FOUND);
        return task;
    }

    async getTasksByBoard(projectId: Types.ObjectId): Promise<TasksSchema[]>{
        // const project = await this.projectsService.getBoardsPopulated(projectId);
        // return project.boards as BoardsSchema[];
    }

    async getTaskByColumn(projectId: Types.ObjectId): Promise<TasksSchema[]>{
        // const project = await this.projectsService.getBoardsPopulated(projectId);
        // return project.boards as BoardsSchema[];
    }

    async deleteTask(boardId: Types.ObjectId, taskId: Types.ObjectId){
        await this.tasksSchema.findByIdAndDelete(taskId)
        await this.boardsService.deleteTask(boardId, taskId)
    }

    async updateTaskInfo(taskId: Types.ObjectId, dto: CreateTaskDto){
        await this.tasksSchema.findByIdAndUpdate(taskId,
            { $set: { name: dto.name, description: dto.description } },
            { new: true, useFindAndModify: false },
        ).exec();
    }

    async changeTaskStatus(taskId: Types.ObjectId, column: ColumnEnum){
        await this.tasksSchema.findByIdAndUpdate(taskId,
            { $set: { column: column } },
            { new: true, useFindAndModify: false },
        ).exec();
        // Call boards.changeTaskStatus()
    }

}
