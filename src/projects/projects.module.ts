import { Module } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectsController } from "./projects.controller";
import { TypegooseModule } from "nestjs-typegoose";
import { ProjectsSchema } from "./projects.schema";
import { UsersService } from "../users/users.service";
import { InvitationsModule } from "./invitations/invitations.module";

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
        InvitationsModule,
    ],
    providers: [ProjectsService],
    controllers: [ProjectsController],
    exports: [ProjectsService],
})
export class ProjectsModule {}
