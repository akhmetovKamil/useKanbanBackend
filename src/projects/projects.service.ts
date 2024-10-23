import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { ProjectsSchema } from "./projects.schema";
import { CreateProjectDto } from "./dto/create.project.dto";
import { UsersService } from "../users/users.service";
import { Types } from "mongoose";
import { ChangeProjectTeamDto } from "./dto/change.project_team.dto";
import { UserRole } from "../common/types/roles.types";
import { UpdateProjectInfoDto } from "./dto/update.project_info.dto";
import { UpdateProjectNameDto } from "./dto/update.project_name.dto";
import { Errors } from "../common/exception.constants";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(ProjectsSchema)
        private readonly projectsSchema: ReturnModelType<typeof ProjectsSchema>,
        private readonly usersService: UsersService,
    ) {}

    async createProject(
        email: string,
        dto: CreateProjectDto,
    ): Promise<ProjectsSchema> {
        const userId = await this.usersService.getUserId(email);
        const team = new Map();
        team.set(userId, {
            position: dto.position,
            role: UserRole.OWNER,
        });
        const newProject = new this.projectsSchema({ ...dto, team });
        await this.usersService.addProject(email, newProject._id);
        return newProject.save();
    }

    async getProject(id: Types.ObjectId): Promise<ProjectsSchema> {
        const project = this.projectsSchema.findById(id).exec();
        if (!project) throw new NotFoundException(Errors.PROJECT_NOT_FOUND);
        return project;
    }

    async getProjects(email: string): Promise<ProjectsSchema[]> {
        const user = await this.usersService.getProjectsPopulated(email);
        return user.projects;
    }

    async updateProjectInfo(id: Types.ObjectId, dto: UpdateProjectInfoDto) {
        await this.projectsSchema
            .findByIdAndUpdate(
                id,
                { $set: { info: dto } },
                { new: true, useFindAndModify: false },
            )
            .exec();
    }

    async updateProjectName(id: Types.ObjectId, dto: UpdateProjectNameDto) {
        await this.projectsSchema
            .findByIdAndUpdate(
                id,
                { $set: { name: dto.name } },
                { new: true, useFindAndModify: false },
            )
            .exec();
    }

    // TODO delete from all users.projects this id
    async deleteProject(id: Types.ObjectId): Promise<void> {
        await this.projectsSchema.findByIdAndDelete(id).exec();
    }

    async getProjectName(id: Types.ObjectId): Promise<string> {
        const project = await this.projectsSchema.findById(id).exec();
        return project.name;
    }

    // TODO is should be email or id
    // TODO add projectId to user here
    async changeUserData(
        projectId: Types.ObjectId,
        team: ChangeProjectTeamDto,
    ) {
        await this.projectsSchema.findByIdAndUpdate(
            projectId,
            { $set: { [`usersData.${team.userId}`]: team } },
            { new: true, useFindAndModify: false },
        );
    }

    // TODO change user.projects
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
