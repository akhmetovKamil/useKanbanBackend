import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { ProjectsSchema } from "./projects.schema";
import { ProjectsCreateDto } from "./dto/projects.create.dto";
import { UsersService } from "../users/users.service";
import { Types } from "mongoose";
import { TeamChangeDto } from "./dto/team.change.dto";
import { UserRole } from "../common/types/roles.types";
import { ProjectsUpdateInfoDto } from "./dto/projects.update_info.dto";
import { ProjectsUpdateNameDto } from "./dto/projects.updata_name.dto";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(ProjectsSchema)
        private readonly projectsSchema: ReturnModelType<typeof ProjectsSchema>,
        private readonly usersService: UsersService,
    ) {}

    async createProject(
        email: string,
        dto: ProjectsCreateDto,
    ): Promise<ProjectsSchema> {
        const userId = await this.usersService.getUserId(email);
        const team = new Map();
        team.set(userId, {
            position: "default", // TODO default position
            role: UserRole.OWNER,
        });
        const newProject = new this.projectsSchema({ ...dto, team });
        await this.usersService.addProject(email, newProject._id);
        return newProject.save();
    }

    async getProject(id: Types.ObjectId): Promise<ProjectsSchema> {
        const project = this.projectsSchema.findById(id).exec();
        if (!project) throw new Error("нет проекта"); // TODO wrong error throwing
        return project;
    }

    async getProjects(email: string): Promise<ProjectsSchema[]> {
        const user = await this.usersService.getProjectsPopulated(email);
        return user.projects;
    }

    async updateProjectInfo(id: Types.ObjectId, dto: ProjectsUpdateInfoDto) {
        await this.projectsSchema
            .findByIdAndUpdate(
                id,
                { $set: { info: dto } },
                { new: true, useFindAndModify: false },
            )
            .exec();
    }

    async updateProjectName(id: Types.ObjectId, dto: ProjectsUpdateNameDto) {
        await this.projectsSchema
            .findByIdAndUpdate(
                id,
                { $set: { name: dto.name } },
                { new: true, useFindAndModify: false },
            )
            .exec();
    }

    async deleteProject(id: Types.ObjectId): Promise<void> {
        await this.projectsSchema.findByIdAndDelete(id).exec();
    }

    // TODO is should be email or id
    async changeUserData(projectId: Types.ObjectId, team: TeamChangeDto) {
        await this.projectsSchema.findByIdAndUpdate(
            projectId,
            { $set: { [`usersData.${team.userId}`]: team } },
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

    async setInvitationHash(
        projectId: Types.ObjectId,
        hash: string,
        name: string,
    ) {
        await this.projectsSchema.findByIdAndUpdate(projectId, {
            $set: { [`invitationHashes.${name}`]: hash },
        });
    }

    async deleteInvitationHash(projectId: Types.ObjectId, name: string) {
        await this.projectsSchema.findByIdAndUpdate(projectId, {
            $unset: { [`invitationHashes.${name}`]: "" },
        });
    }
}
