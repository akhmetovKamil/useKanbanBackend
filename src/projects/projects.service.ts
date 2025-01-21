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
import { UsersSchema } from "../users/users.schema";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectModel(ProjectsSchema)
        private readonly projectsSchema: ReturnModelType<typeof ProjectsSchema>,
        private readonly usersService: UsersService,
    ) {}

    async createProject(
        id: Types.ObjectId,
        dto: CreateProjectDto,
    ): Promise<ProjectsSchema> {
        const team = new Map();
        team.set(id, {
            position: dto.position,
            role: UserRole.OWNER,
        });
        const newProject = new this.projectsSchema({ ...dto, team });
        await this.usersService.addProject(id, newProject._id);
        return newProject.save();
    }

    async getProject(id: Types.ObjectId): Promise<ProjectsSchema> {
        const project = await this.projectsSchema.findById(id).exec();
        if (!project) throw new NotFoundException(Errors.PROJECT_NOT_FOUND);
        return project;
    }

    async getProjects(email: string): Promise<ProjectsSchema[]> {
        const user = await this.usersService.getProjectsPopulated(email);
        return user.projects as ProjectsSchema[];
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

    async deleteProject(id: Types.ObjectId): Promise<void> {
        await this.usersService.deleteProjectFromUsers(id);
        await this.projectsSchema.findByIdAndDelete(id).exec();
    }

    async getProjectName(id: Types.ObjectId): Promise<string> {
        const project = await this.projectsSchema.findById(id).exec();
        return project.name;
    }

    async changeUserData(
        projectId: Types.ObjectId,
        team: ChangeProjectTeamDto,
    ) {
        await this.projectsSchema.findByIdAndUpdate(
            projectId,
            { $set: { [`team.${team.userId}`]: team } },
            { new: true, useFindAndModify: false },
        );
    }

    async deleteUser(projectId: Types.ObjectId, userId: Types.ObjectId) {
        await this.projectsSchema.findByIdAndUpdate(
            projectId,
            { $set: { [`team.${userId}.role`]: UserRole.DISABLED } },
            { new: true, useFindAndModify: false },
        );
    }

    async leaveProject(projectId: Types.ObjectId, id: Types.ObjectId) {
        await this.deleteUser(projectId, id);
    }

    async setInvitationHash(
        projectId: Types.ObjectId,
        name: string,
        hash: string,
    ) {
        await this.projectsSchema.findByIdAndUpdate(projectId, {
            $set: { [`invitationHashes.${name}`]: hash },
        });
    }

    async deleteInvitationHash(projectId: Types.ObjectId, name: string) {
        await this.projectsSchema
            .findByIdAndUpdate(
                projectId,
                { $unset: { [`invitationHashes.${name}`]: 1 } },
                { new: true, useFindAndModify: false },
            )
            .exec();
    }

    async getUserRoleByProjectId(
        userId: Types.ObjectId,
        projectId: Types.ObjectId,
    ) {
        const project = await this.getProject(projectId);
        console.log(userId, project);
        return project.team.get(userId).role;
    }

    async pushBoard(projectId: Types.ObjectId,boardId: Types.ObjectId): Promise<void>{
        await this.projectsSchema.updateOne(
            { _id: projectId },
            { $push: { "boards": boardId } }
        );
    }

    async popBoard(projectId: Types.ObjectId,boardId: Types.ObjectId): Promise<void>{
        await this.projectsSchema.updateOne(
            { _id: projectId },
            { $pull: { "boards": { $in: boardId } } }
        );
    }

    async getBoardsPopulated(projectId: Types.ObjectId):Promise<ProjectsSchema>{
        return this.projectsSchema.findOne({ _id: projectId }).populate("boards").exec();
    }


}
