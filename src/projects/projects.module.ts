import { Module } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectsController } from "./projects.controller";
import { TypegooseModule } from "nestjs-typegoose";
import { ProjectsSchema } from "./projects.schema";
import { UsersService } from "../users/users.service";

@Module({
    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: ProjectsSchema,
                schemaOptions: {
                    collection: "Projects",
                },
            },
        ]),
        UsersService,
    ],
    providers: [ProjectsService],
    controllers: [ProjectsController],
})
export class ProjectsModule {}
