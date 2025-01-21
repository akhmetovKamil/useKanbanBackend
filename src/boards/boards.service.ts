import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ProjectsSchema } from "../projects/projects.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { BoardsSchema } from "./boards.schema";
import { ProjectsService } from "../projects/projects.service";

@Injectable()
export class BoardsService {
    constructor(
        @InjectModel(ProjectsSchema)
        private readonly boardsSchema: ReturnModelType<typeof BoardsSchema>,
        private readonly projectsService: ProjectsService,
    ) {}


    async createBoard(){}
    async deleteBoard(){}
    async updateBoardInfo(){}

    async changeTaskStatus(){}
    async addTask(){}
    async deleteTask(){}
}
