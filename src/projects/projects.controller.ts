import { Body, Controller, Post } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { GetCurrentEmail } from "../common/decorators/get_current_email.decorator";
import { CreateProjectDto } from "./dto/create.project.dto";

@Controller("projects")
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    async createProject(
        @GetCurrentEmail() email: string,
        @Body() dto: CreateProjectDto,
    ) {
        return this.projectsService.createProject(email, dto);
    }
}
