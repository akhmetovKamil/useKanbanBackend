import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { BoardsSchema } from "./boards.schema";
import { ProjectsService } from "../projects/projects.service";
import { Types } from "mongoose";
import { Errors } from "../common/exception.constants";
import { ProjectsSchema } from "../projects/projects.schema";
import { ColumnEnum } from "./tasks/tasks.type";
import { TasksSchema } from "./tasks/tasks.schema";

@Injectable()
export class BoardsService {
    constructor(
        @InjectModel(BoardsSchema)
        private readonly boardsSchema: ReturnModelType<typeof BoardsSchema>,
        private readonly projectsService: ProjectsService,
    ) {}


    async createBoard(projectId: Types.ObjectId, name: string){
        const board = new this.boardsSchema({name})
        await this.projectsService.pushBoard(projectId,board._id)
        return board.save()
    }

    async getBoard(boardId: Types.ObjectId): Promise<BoardsSchema>{
        const board = await this.boardsSchema.findById(boardId).exec();
        if (!board) throw new NotFoundException(Errors.BOARD_NOT_FOUND);
        return board;
    }

    async getAllBoards(projectId: Types.ObjectId): Promise<BoardsSchema[]>{
        const project = await this.projectsService.getBoardsPopulated(projectId);
        return project.boards as BoardsSchema[];
    }

    async deleteBoard(projectId: Types.ObjectId,boardId: Types.ObjectId){
        await this.boardsSchema.findByIdAndDelete(boardId)
        await this.projectsService.popBoard(projectId,boardId)
    }

    async updateBoardInfo(boardId: Types.ObjectId, newName: string){
        await this.boardsSchema.findByIdAndUpdate(boardId,
            { $set: { name: newName } },
            { new: true, useFindAndModify: false },
        ).exec();
    }

    async changeTaskStatus(boardId: Types.ObjectId, taskId: Types.ObjectId, oldColumn: ColumnEnum, newColumn: ColumnEnum){
        await this.pushTask(boardId,taskId,newColumn)
        await this.popTask(boardId,taskId,oldColumn)
    }

    async pushTask(boardId: Types.ObjectId, taskId: Types.ObjectId, column: ColumnEnum): Promise<void>{
        await this.boardsSchema.updateOne(
            { _id: boardId },
            { $push: { [column]: taskId } }
        );
    }

    async popTask(boardId: Types.ObjectId, taskId: Types.ObjectId, column: ColumnEnum): Promise<void>{
        await this.boardsSchema.updateOne(
            { _id: boardId },
            { $pull: { [column]: { $in: taskId } } }
        );
    }

    async getBoardPopulated(boardId: Types.ObjectId):Promise<BoardsSchema>{
        return this.boardsSchema.findOne({ _id: boardId }).populate([
            { path: 'backlog' },
            { path: 'progress' },
            { path: 'done' },
        ]).exec();
    }

    async getBoardPopulatedColumn(boardId: Types.ObjectId, column: ColumnEnum):Promise<TasksSchema[]>{
        return (await this.boardsSchema.findOne({ _id: boardId }).populate(column).exec())[column];
    }
}
