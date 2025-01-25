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
        await this.boardsService.pushTask(boardId, task._id, ColumnEnum.BACKLOG)
        return task.save()
    }

    async getTask(taskId: Types.ObjectId): Promise<TasksSchema>{
        const task = await this.tasksSchema.findById(taskId).exec();
        if (!task) throw new NotFoundException(Errors.TASK_NOT_FOUND);
        return task;
    }

    async getTasksByBoard(boardId: Types.ObjectId): Promise<TasksSchema[]>{
        const board = await this.boardsService.getBoardPopulated(boardId)
        const backlog = board.backlog as TasksSchema[]
        const progress = board.progress as TasksSchema[]
        const done = board.done as TasksSchema[]
        return [...backlog,...progress,...done]
    }

    async getTaskByColumn(boardId: Types.ObjectId, column: ColumnEnum): Promise<TasksSchema[]>{
        const tasks = await this.boardsService.getBoardPopulatedColumn(boardId, column)
        return tasks as TasksSchema[]
    }

    async deleteTask(boardId: Types.ObjectId, taskId: Types.ObjectId){
        const task = await this.tasksSchema.findByIdAndDelete(taskId)
        await this.boardsService.popTask(boardId, taskId, task.column)
    }

    async updateTaskInfo(taskId: Types.ObjectId, dto: CreateTaskDto){
        await this.tasksSchema.findByIdAndUpdate(taskId,
            { $set: { name: dto.name, description: dto.description } },
            { new: true, useFindAndModify: false },
        ).exec();
    }

    async changeTaskStatus(boardId:Types.ObjectId, taskId: Types.ObjectId, newColumn: ColumnEnum){
        const oldColumn = (await this.tasksSchema.findById(taskId)).column
        await this.tasksSchema.findByIdAndUpdate(taskId,
            { $set: { column: newColumn } },
            { new: true, useFindAndModify: false },
        ).exec();
        await this.boardsService.changeTaskStatus(boardId, taskId, oldColumn, newColumn)
    }

}
