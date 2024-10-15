import { Module } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectsController } from "./projects.controller";
import { TypegooseModule } from "nestjs-typegoose";
import { ProjectsSchema } from "./projects.schema";

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
    ],
    providers: [ProjectsService],
    controllers: [ProjectsController],
})
export class ProjectsModule {}
