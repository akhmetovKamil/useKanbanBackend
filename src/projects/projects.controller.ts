import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { GetCurrentEmail } from "../common/decorators/get_current_email.decorator";
import { CreateProjectDto } from "./dto/create.project.dto";
import { ParseObjectIdPipe } from "../common/pipes/parse_object_id.pipe";
import { Types } from "mongoose";
import { UpdateProjectInfoDto } from "./dto/update.project_info.dto";
import { UpdateProjectNameDto } from "./dto/update.project_name.dto";
import { ChangeProjectTeamDto } from "./dto/change.project_team.dto";
import { Roles } from "../common/decorators/role.decorator";
import { UserRole } from "../common/types/roles.types";
import { RBACGuard } from "../auth/guards/rbac.guard";
import { GetCurrentId } from "../common/decorators/get_current_id.decorator";

@Controller("projects")
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createProject(
        @GetCurrentId() id: Types.ObjectId,
        @Body() dto: CreateProjectDto,
    ) {
        return this.projectsService.createProject(id, dto);
    }

    @Get("all/")
    async getProjects(@GetCurrentEmail() email: string) {
        return this.projectsService.getProjects(email);
    }

    @Roles(UserRole.USER, UserRole.ADMIN, UserRole.OWNER, UserRole.VIEWER)
    @Get("/:projectId")
    async getProject(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
    ) {
        return this.projectsService.getProject(projectId);
    }

    @Roles(UserRole.ADMIN, UserRole.OWNER)
    @UseGuards(RBACGuard)
    @Delete("user/:projectId/:userId")
    async deleteUser(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Param("userId", ParseObjectIdPipe) userId: Types.ObjectId,
    ) {
        return this.projectsService.deleteUser(projectId, userId);
    }

    @Roles(UserRole.USER, UserRole.ADMIN)
    @Delete("leave/:projectId")
    async leaveProject(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @GetCurrentId() id: Types.ObjectId,
    ) {
        return this.projectsService.leaveProject(projectId, id);
    }

    @Roles(UserRole.OWNER)
    @Delete("project/:projectId")
    async deleteProject(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
    ) {
        return this.projectsService.deleteProject(projectId);
    }

    @Roles(UserRole.ADMIN, UserRole.OWNER)
    @Put("info/:projectId")
    async updateProjectInfo(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Body() dto: UpdateProjectInfoDto,
    ) {
        return this.projectsService.updateProjectInfo(projectId, dto);
    }

    @Roles(UserRole.ADMIN, UserRole.OWNER)
    @Put("name/:projectId")
    async updateProjectName(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Body() dto: UpdateProjectNameDto,
    ) {
        return this.projectsService.updateProjectName(projectId, dto);
    }

    @Roles(UserRole.ADMIN, UserRole.OWNER)
    @Put("team/:projectId")
    async updateProjectTeam(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Body() dto: ChangeProjectTeamDto,
    ) {
        return this.projectsService.changeUserData(projectId, dto);
    }
}
