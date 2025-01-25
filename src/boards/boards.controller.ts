import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { Types } from "mongoose";
import { ParseObjectIdPipe } from "../common/pipes/parse_object_id.pipe";
import { BoardsService } from "./boards.service";

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

    @Post("/:projectId")
    @HttpCode(HttpStatus.CREATED)
    async createBoard(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Query("name") name: string,
    ) {
        return this.boardsService.createBoard(projectId, name);
    }

    @Get("all/:projectId")
    async getBoards(@Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,) {
        return this.boardsService.getAllBoards(projectId);
    }

    @Get("/:boardId")
    async getBoard(
        @Param("boardId", ParseObjectIdPipe) boardId: Types.ObjectId,
    ) {
        return this.boardsService.getBoard(boardId);
    }

    @Delete(":projectId/:boardId")
    async deleteBoard(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Param("boardId", ParseObjectIdPipe) boardId: Types.ObjectId,
    ) {
        return this.boardsService.deleteBoard(projectId,boardId);
    }

    @Put(":boardId")
    async updateBoardName(
        @Param("boardId", ParseObjectIdPipe) boardId: Types.ObjectId,
        @Query("name") name: string,
    ) {
        return this.boardsService.updateBoardInfo(boardId, name);
    }
}
