import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ProjectsSchema } from "../projects/projects.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { BoardsSchema } from "./boards.schema";
import { ProjectsService } from "../projects/projects.service";
import { Types } from "mongoose";
import { Errors } from "../common/exception.constants";

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
        await this.projectsService.pushBoard(projectId,boardId)
    }

    async updateBoardInfo(boardId: Types.ObjectId, newName: string){
        await this.boardsSchema.findByIdAndUpdate(boardId,
            { $set: { name: newName } },
            { new: true, useFindAndModify: false },
        ).exec();
    }

    async changeTaskStatus(){}
    async addTask(){}
    async deleteTask(){}
}
