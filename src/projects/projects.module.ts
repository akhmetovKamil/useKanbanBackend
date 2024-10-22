import { forwardRef, Module } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectsController } from "./projects.controller";
import { TypegooseModule } from "nestjs-typegoose";
import { ProjectsSchema } from "./projects.schema";
import { InvitationsModule } from "./invitations/invitations.module";
import { UsersModule } from "../users/users.module";

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
        UsersModule,
        forwardRef(() => InvitationsModule),
    ],
    providers: [ProjectsService],
    controllers: [ProjectsController],
    exports: [ProjectsService],
})
export class ProjectsModule {}
