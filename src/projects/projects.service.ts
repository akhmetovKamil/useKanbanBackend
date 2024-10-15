import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { ProjectsSchema } from "./projects.schema";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(ProjectsSchema)
        private readonly projectsSchema: ReturnModelType<typeof ProjectsSchema>,
    ) {}

    async createProject() {}
}
