import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { ProjectsSchema } from "./projects.schema";
import { ProjectsCreateDto } from "./dto/projects.create.dto";
import { UsersService } from "../users/users.service";
import { Types } from "mongoose";
import { TeamChangeDto } from "./dto/team.change.dto";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(ProjectsSchema)
        private readonly projectsSchema: ReturnModelType<typeof ProjectsSchema>,
        private readonly usersService: UsersService,
    ) {}

    async createProject(email, dto: ProjectsCreateDto) {
        const newProject = new this.projectsSchema({ dto });

        await this.usersService.addProject(email, newProject._id);
    }

    async getProject() {}
    async getProjects() {}
    async updateProject() {}
    async deleteProject() {}
    async inviteUser() {}
    async acceptInvitation() {}

    async changeUserData(projectId: Types.ObjectId, team: TeamChangeDto) {
        const userId = this.usersService.getUserId(team.email);
        await this.projectsSchema.findByIdAndUpdate(
            projectId,
            { $set: { [`usersData.${userId}`]: team } },
            { new: true, useFindAndModify: false },
        );
    }

    async deleteUser(projectId: Types.ObjectId, email: string) {
        const userId = this.usersService.getUserId(email);
        await this.projectsSchema.findByIdAndUpdate(
            projectId,
            { $unset: { [`usersData.${userId}`]: "" } },
            { new: true, useFindAndModify: false },
        );
    }
}
